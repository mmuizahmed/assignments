(function () {
    "use strict";

    var API_URL = "https://prod-api.telebothost.com/ownlang/webhook/96668411?command=ai&sig=f1a37fe23be385f93cad519b0d88546cabbb735ca346b77b2b7134d7094a9c34";

    var CHAT_MODEL = "sarvam-30b";
    var TTS_MODEL = "bulbul:v3";
    var TTS_SPEAKER = "shubh";
    var TTS_LANG = "en-IN";
    var MAX_SPEECH_CHARS = 70;

    var TOOLS = [
        {
            type: "function",
            function: {
                name: "set_budget",
                description: "Set or update the user's total monthly budget amount",
                parameters: {
                    type: "object",
                    properties: {
                        amount: { type: "number", description: "Total budget amount in the same currency as expenses" }
                    },
                    required: ["amount"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "add_expense",
                description: "Record one purchase or expense item",
                parameters: {
                    type: "object",
                    properties: {
                        title: { type: "string", description: "Name of the product or expense" },
                        amount: { type: "number", description: "Cost of the expense" }
                    },
                    required: ["title", "amount"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "add_expenses",
                description: "Add multiple purchases in one request when user lists more than one item",
                parameters: {
                    type: "object",
                    properties: {
                        items: {
                            type: "array",
                            description: "List of expenses to add",
                            items: {
                                type: "object",
                                properties: {
                                    title: { type: "string", description: "Item name" },
                                    amount: { type: "number", description: "Item cost" }
                                },
                                required: ["title", "amount"]
                            }
                        }
                    },
                    required: ["items"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "edit_expense",
                description: "Update an existing expense name and/or price",
                parameters: {
                    type: "object",
                    properties: {
                        current_title: { type: "string", description: "Existing expense name to find" },
                        new_title: { type: "string", description: "Updated name (optional)" },
                        new_amount: { type: "number", description: "Updated price (optional)" }
                    },
                    required: ["current_title"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "get_summary",
                description: "Fetch the latest budget overview including totals and balance",
                parameters: { type: "object", properties: {} }
            }
        }
    ];

    var els = {};
    var recognition = null;
    var micGranted = false;
    var micRequesting = false;
    var isListening = false;
    var isHolding = false;
    var isProcessing = false;
    var isSpeaking = false;
    var releasedByUser = false;
    var currentAudio = null;
    var currentAudioUrl = null;
    var finalTranscript = "";
    var hudTimer = null;

    function $(id) {
        return document.getElementById(id);
    }

    function setAgentState(state) {
        els.agent.className = "siri-agent" + (state ? " is-" + state : "");
    }

    function setStatus(text) {
        els.status.textContent = text;
    }

    function setHint(text) {
        els.hint.textContent = text;
    }

    function setTranscript(text, interim) {
        els.transcript.textContent = text;
        els.transcript.className = "siri-transcript" + (interim ? " is-interim" : "");
    }

    function showHud() {
        clearTimeout(hudTimer);
        els.hud.hidden = false;
    }

    function scheduleHideHud() {
        clearTimeout(hudTimer);
        hudTimer = setTimeout(function () {
            if (!isListening && !isProcessing && !isSpeaking && !isHolding) {
                els.hud.hidden = true;
                els.reply.hidden = true;
                setTranscript("");
                setAgentState("");
                setHint("Hold to speak");
            }
        }, 3200);
    }

    function showReply(text, isError) {
        showHud();
        els.reply.hidden = false;
        els.reply.textContent = text;
        els.reply.className = "siri-reply" + (isError ? " is-error" : "");
    }

    function buildSystemPrompt() {
        var s = window.BudgetApp.getSummary();
        var items = s.items.length
            ? s.items.map(function (e) { return e.index + ". " + e.name + " (" + e.amount + ")"; }).join("\n")
            : "none";

        return [
            "You are the Expense Tracker assistant — nothing else.",
            "",
            "STRICT RULES (never break):",
            "- Only help with budget, expenses, and balance in this app.",
            "- Never reveal your model, API, provider, or who built you.",
            "- Never say Sarvam, OpenAI, Muiz, developer, or AI company names.",
            "- If asked who you are: say you are the expense tracker helper only.",
            "- Refuse off-topic chat. Redirect to budget tasks.",
            "- Reply in English only.",
            "",
            "TOOLS:",
            "- set_budget: set total budget",
            "- add_expense: one item",
            "- add_expenses: multiple items in one request (use when user lists 2+ purchases)",
            "- edit_expense: change name or price of existing item",
            "- get_summary: show totals",
            "",
            "STYLE:",
            "- Understand casual speech: 'bought chai for 40', 'how much left', 'change samosa price to 15'",
            "- Always use tools for actions. Never fake updates.",
            "- Use the tools API only. Never output <tool_call> XML in your reply.",
            "- Spoken reply: max 12 words, max 70 characters.",
            "",
            "LIVE DATA:",
            "Budget: " + s.budget,
            "Spent: " + s.expenses,
            "Balance: " + s.balance,
            "Over budget: " + (s.overBudget ? "yes" : "no"),
            "Expenses:",
            items
        ].join("\n");
    }

    function buildReplyPrompt() {
        var s = window.BudgetApp.getSummary();
        return [
            "Reply in English only.",
            "Confirm the action in one short sentence.",
            "Max 12 words. Max 70 characters.",
            "Balance now: " + s.balance + "."
        ].join(" ");
    }

    function trimForSpeech(text) {
        var t = (text || "").trim();
        if (t.length <= MAX_SPEECH_CHARS) return t;
        return t.slice(0, MAX_SPEECH_CHARS - 1).trim() + ".";
    }

    function runTool(name, args) {
        var summary;

        if (name === "set_budget") {
            var budgetVal = args.amount != null ? args.amount : args.budget_amount;
            var budgetResult = window.BudgetApp.setBudgetAmount(budgetVal, true);
            summary = window.BudgetApp.getSummary();
            if (!budgetResult.ok) {
                return { success: false, error: budgetResult.error };
            }
            return {
                success: true,
                budget: summary.budget,
                balance: summary.balance,
                over_budget: summary.overBudget
            };
        }

        if (name === "add_expense") {
            var expenseResult = window.BudgetApp.addExpenseItem(args.title, args.amount, true);
            summary = window.BudgetApp.getSummary();
            if (!expenseResult.ok) {
                return { success: false, error: expenseResult.error };
            }
            return {
                success: true,
                added: [{ title: args.title, amount: args.amount }],
                balance: summary.balance,
                over_budget: summary.overBudget
            };
        }

        if (name === "add_expenses") {
            var batchResult = window.BudgetApp.addExpenseItems(args.items, true);
            summary = window.BudgetApp.getSummary();
            if (!batchResult.ok) {
                return {
                    success: false,
                    error: batchResult.error,
                    added: batchResult.added || [],
                    balance: summary.balance,
                    over_budget: summary.overBudget
                };
            }
            return {
                success: true,
                added: batchResult.added,
                count: batchResult.count,
                balance: summary.balance,
                over_budget: summary.overBudget
            };
        }

        if (name === "edit_expense") {
            var editResult = window.BudgetApp.editExpenseItem(
                args.current_title,
                args.new_title,
                args.new_amount,
                true
            );
            summary = window.BudgetApp.getSummary();
            if (!editResult.ok) {
                return { success: false, error: editResult.error };
            }
            return {
                success: true,
                old_title: editResult.old_title,
                new_title: editResult.new_title,
                new_amount: editResult.new_amount,
                balance: summary.balance,
                over_budget: summary.overBudget
            };
        }

        if (name === "get_summary") {
            summary = window.BudgetApp.getSummary();
            return {
                success: true,
                budget: summary.budget,
                spent: summary.expenses,
                balance: summary.balance,
                over_budget: summary.overBudget
            };
        }

        return { success: false, error: "Unknown action." };
    }

    function apiError(body) {
        if (!body || !body.error) return "Request failed";
        return typeof body.error === "string" ? body.error : body.error.message;
    }

    function apiPost(type, payload) {
        return fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: type, payload: payload })
        }).then(function (res) {
            return res.json().then(function (body) {
                if (!res.ok) {
                    throw new Error(apiError(body) || "Request failed (" + res.status + ")");
                }
                return body.data || body;
            });
        });
    }

    function chatCompletions(messages, toolChoice) {
        var payload = {
            model: CHAT_MODEL,
            messages: messages,
            tools: TOOLS,
            tool_choice: toolChoice,
            temperature: toolChoice === "auto" ? 0.2 : 0.3,
            max_tokens: toolChoice === "auto" ? 500 : 64
        };

        if (toolChoice === "none") {
            payload.reasoning_effort = null;
        }

        return apiPost("chat", payload);
    }

    function getMessage(data) {
        var message = data.choices && data.choices[0] && data.choices[0].message;
        if (!message) throw new Error("No response from assistant.");
        return message;
    }

    function normalizeToolArgs(name, args) {
        if (name === "set_budget" && args.budget_amount != null && args.amount == null) {
            args.amount = parseFloat(args.budget_amount);
        }
        if (name === "add_expense") {
            if (args.cost != null && args.amount == null) args.amount = parseFloat(args.cost);
            if (args.name != null && args.title == null) args.title = args.name;
        }
        return args;
    }

    function parseContentToolCalls(content) {
        if (!content || content.indexOf("<tool_call>") === -1) return null;

        var calls = [];
        var blockRe = /<tool_call>\s*([\w_]+)\s*([\s\S]*?)<\/tool_call>/gi;
        var block;
        var n = 0;

        while ((block = blockRe.exec(content)) !== null) {
            var fnName = block[1].trim();
            var body = block[2];
            var args = {};
            var argRe = /<arg_key>\s*([\s\S]*?)\s*<\/arg_key>\s*<arg_value>\s*([\s\S]*?)\s*<\/arg_value>/gi;
            var arg;

            while ((arg = argRe.exec(body)) !== null) {
                var key = arg[1].trim();
                var val = arg[2].trim();
                if (val !== "" && !isNaN(val)) val = parseFloat(val);
                args[key] = val;
            }

            args = normalizeToolArgs(fnName, args);
            calls.push({
                id: "call_xml_" + n,
                type: "function",
                function: {
                    name: fnName,
                    arguments: JSON.stringify(args)
                }
            });
            n += 1;
        }

        return calls.length ? calls : null;
    }

    function resolveToolCalls(message) {
        if (message.tool_calls && message.tool_calls.length) {
            return message.tool_calls;
        }
        return parseContentToolCalls(message.content);
    }

    function callAI(userText) {
        var messages = [
            { role: "system", content: buildSystemPrompt() },
            { role: "user", content: userText }
        ];

        return chatCompletions(messages, "auto").then(function (data) {
            var message = getMessage(data);
            var toolCalls = resolveToolCalls(message);

            if (!toolCalls || !toolCalls.length) {
                if (message.content && message.content.indexOf("<tool_call>") === -1) {
                    return { ok: true, message: message.content.trim() };
                }
                throw new Error("Assistant could not process that request.");
            }

            var parsedFromXml = !(message.tool_calls && message.tool_calls.length);

            messages.push({
                role: "assistant",
                content: parsedFromXml ? "" : (message.content || ""),
                tool_calls: toolCalls
            });

            var allOk = true;
            var i;

            for (i = 0; i < toolCalls.length; i++) {
                var args;
                try {
                    args = JSON.parse(toolCalls[i].function.arguments);
                } catch (e) {
                    throw new Error("Invalid tool arguments.");
                }

                args = normalizeToolArgs(toolCalls[i].function.name, args);
                var toolResult = runTool(toolCalls[i].function.name, args);
                if (!toolResult.success) allOk = false;

                messages.push({
                    role: "tool",
                    tool_call_id: toolCalls[i].id,
                    content: JSON.stringify(toolResult)
                });
            }

            messages[0].content = buildReplyPrompt();

            return chatCompletions(messages, "none").then(function (followUp) {
                var reply = getMessage(followUp);
                var text = (reply.content || "").trim();
                if (!text) {
                    throw new Error("Assistant returned an empty reply. Try again.");
                }
                return { ok: allOk, message: text };
            });
        });
    }

    function stopSpeech() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        if (currentAudioUrl) {
            URL.revokeObjectURL(currentAudioUrl);
            currentAudioUrl = null;
        }
        isSpeaking = false;
    }

    function speak(text) {
        stopSpeech();
        isSpeaking = true;
        setAgentState("speaking");
        setStatus("Speaking");

        return apiPost("tts", {
            text: trimForSpeech(text),
            target_language_code: TTS_LANG,
            model: TTS_MODEL,
            speaker: TTS_SPEAKER
        }).then(function (data) {
            var chunks = data.audios;
            if (!chunks || !chunks.length) {
                throw new Error("No audio returned.");
            }

            var binary = atob(chunks.join(""));
            var bytes = new Uint8Array(binary.length);
            for (var i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }

            currentAudioUrl = URL.createObjectURL(new Blob([bytes], { type: "audio/wav" }));
            currentAudio = new Audio(currentAudioUrl);

            return new Promise(function (resolve, reject) {
                currentAudio.onended = function () {
                    stopSpeech();
                    scheduleHideHud();
                    resolve();
                };
                currentAudio.onerror = function () {
                    stopSpeech();
                    scheduleHideHud();
                    reject(new Error("Audio playback failed."));
                };
                currentAudio.play().catch(reject);
            });
        });
    }

    function processCommand(text) {
        if (isProcessing) return;

        var command = (text || "").trim();
        if (!command) {
            showReply("Hold the button and say something like add samosa for 10.", true);
            setHint("Hold to speak");
            scheduleHideHud();
            return;
        }

        if (!window.BudgetApp) {
            showReply("App is still loading. Try again.", true);
            scheduleHideHud();
            return;
        }

        isProcessing = true;
        showHud();
        setAgentState("thinking");
        setStatus("Thinking");
        setHint("One moment...");
        els.orb.disabled = true;

        callAI(command).then(function (result) {
            showReply(result.message, !result.ok);
            setStatus(result.ok ? "Done" : "Try again");
            setAgentState(result.ok ? "done" : "error");
            setHint("Hold to speak");
            return speak(result.message).catch(function () {
                scheduleHideHud();
            });
        }).catch(function (err) {
            var msg = err.message || "Something went wrong.";
            showReply(msg, true);
            setStatus("Error");
            setAgentState("error");
            setHint("Hold to speak");
            scheduleHideHud();
        }).finally(function () {
            isProcessing = false;
            els.orb.disabled = false;
            finalTranscript = "";
        });
    }

    function requestMicAccess() {
        if (micGranted) return Promise.resolve();
        if (micRequesting) return Promise.reject(new Error("Mic request in progress"));

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showReply("Microphone not supported in this browser.", true);
            return Promise.reject(new Error("unsupported"));
        }

        micRequesting = true;
        showHud();
        setAgentState("thinking");
        setStatus("Microphone");
        setHint("Allow mic access...");

        return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
            stream.getTracks().forEach(function (track) {
                track.stop();
            });
            micGranted = true;
            micRequesting = false;
            setupRecognition();
            setAgentState("");
            setHint("Hold to speak");
            scheduleHideHud();
        }).catch(function (err) {
            micRequesting = false;
            setAgentState("error");

            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                setStatus("Blocked");
                setHint("Allow mic in browser settings");
                showReply("Microphone access blocked. Allow it and hold the button again.", true);
            } else if (err.name === "NotFoundError") {
                setStatus("No mic");
                showReply("No microphone found.", true);
            } else {
                setStatus("Mic error");
                showReply("Could not access microphone.", true);
            }

            scheduleHideHud();
            throw err;
        });
    }

    function setupRecognition() {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition || recognition) return;

        recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = function () {
            isListening = true;
            showHud();
            setAgentState("listening");
            setStatus("Listening");
            setHint("Release when done");
        };

        recognition.onresult = function (event) {
            var interim = "";
            var final = "";

            for (var i = 0; i < event.results.length; i++) {
                var piece = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final += piece;
                } else {
                    interim += piece;
                }
            }

            finalTranscript = final.trim();
            var display = (final + interim).trim();
            setTranscript(display, !!interim && !final);
        };

        recognition.onend = function () {
            isListening = false;

            if (!releasedByUser) {
                if (isHolding && micGranted) {
                    try { recognition.start(); } catch (e) { /* ignore */ }
                }
                return;
            }

            releasedByUser = false;
            var said = (finalTranscript || els.transcript.textContent || "").trim();
            setTranscript(said, false);

            if (!isProcessing) {
                if (said) {
                    processCommand(said);
                } else {
                    setAgentState("");
                    setStatus("");
                    setHint("Hold to speak");
                    scheduleHideHud();
                }
            }
        };

        recognition.onerror = function (event) {
            if (event.error === "no-speech" && isHolding) return;

            isListening = false;

            if (event.error === "not-allowed" || event.error === "service-not-allowed") {
                micGranted = false;
                setAgentState("error");
                setStatus("Blocked");
                showReply("Allow microphone access and try again.", true);
                scheduleHideHud();
                return;
            }

            if (event.error === "no-speech") {
                setAgentState("");
                setHint("Hold to speak");
                showReply("Didn't catch that. Hold and speak again.", true);
                scheduleHideHud();
                return;
            }

            if (event.error === "aborted") {
                if (!isProcessing) {
                    setAgentState("");
                    setHint("Hold to speak");
                    scheduleHideHud();
                }
                return;
            }

            setAgentState("error");
            showReply("Voice capture failed. Try again.", true);
            scheduleHideHud();
        };
    }

    function startListening() {
        if (isListening || isProcessing || !recognition) return;

        stopSpeech();
        releasedByUser = false;
        finalTranscript = "";
        setTranscript("");
        showHud();
        els.reply.hidden = true;

        try {
            recognition.start();
        } catch (e) {
            setHint("Hold to speak");
        }
    }

    function stopListening() {
        if (!recognition) return;
        releasedByUser = true;
        isHolding = false;
        setAgentState("");

        if (isListening) {
            try {
                recognition.stop();
            } catch (e) { /* ignore */ }
        } else {
            var said = (finalTranscript || els.transcript.textContent).trim();
            if (said && !isProcessing) {
                processCommand(said);
            } else {
                scheduleHideHud();
            }
        }
    }

    function onHoldStart(e) {
        if (isProcessing || isSpeaking) return;
        e.preventDefault();

        isHolding = true;
        setAgentState("holding");

        requestMicAccess().then(function () {
            if (isHolding) startListening();
        }).catch(function () {
            isHolding = false;
            setAgentState("");
        });
    }

    function onHoldEnd() {
        if (!isHolding && !isListening) return;
        stopListening();
    }

    function init() {
        els.agent = $("siriAgent");
        els.hud = $("siriHud");
        els.status = $("siriStatus");
        els.transcript = $("siriTranscript");
        els.reply = $("siriReply");
        els.orb = $("siriOrb");
        els.hint = $("siriHint");

        if (!els.agent || !els.orb) return;

        els.orb.addEventListener("pointerdown", onHoldStart);
        els.orb.addEventListener("pointerup", onHoldEnd);
        els.orb.addEventListener("pointercancel", onHoldEnd);
        els.orb.addEventListener("pointerleave", function (e) {
            if (isHolding) onHoldEnd(e);
        });
        els.orb.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        });

        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: "microphone" }).then(function (status) {
                if (status.state === "granted") {
                    requestMicAccess().catch(function () { /* handled in UI */ });
                }
                status.onchange = function () {
                    if (status.state === "granted" && !micGranted) {
                        requestMicAccess().catch(function () { /* handled in UI */ });
                    }
                };
            }).catch(function () { /* not supported */ });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
