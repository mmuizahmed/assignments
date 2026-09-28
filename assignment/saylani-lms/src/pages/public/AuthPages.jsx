import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";
import { db } from "../../data/db";
import { useApp } from "../../context/AppContext";
import { he } from "../../lib/toast";
import { LOGO } from "../../lib/utils";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Spinner,
  Tabs,
  TabsContent,
} from "../../components/ui";

const ROLE_PRESETS = {
  student: {
    portal: "Student Portal",
    title: "Login",
    description: "Kindly provide the CNIC number and password used during SMIT course registration.",
    idLabel: "CNIC *",
    idType: "text",
    identifier: db.student.student_cnic,
    password: db.student.password,
  },
  teacher: {
    portal: "Trainer Portal",
    title: "Login",
    description: "Kindly provide your email and password to access the trainer portal.",
    idLabel: "Email *",
    idType: "email",
    identifier: db.teacher.email,
    password: db.teacher.password,
  },
  admin: {
    portal: "Admin Portal",
    title: "Login",
    description: "Provide your administrator email and password to access the admin portal.",
    idLabel: "Email *",
    idType: "email",
    identifier: "admin@example.local",
    password: "admin1234",
  },
};

export function StudentLogin() {
  const navigate = useNavigate();
  const { signInStudent, signInTrainer, signInAdmin } = useApp();
  const tokenRef = useRef(false);
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState(ROLE_PRESETS.student.identifier);
  const [password, setPassword] = useState(ROLE_PRESETS.student.password);

  const preset = ROLE_PRESETS[role];

  const selectRole = (next) => {
    setRole(next);
    setIdentifier(ROLE_PRESETS[next].identifier);
    setPassword(ROLE_PRESETS[next].password);
    setShowPassword(false);
  };

  const submit = () => {
    setLoading(true);
    let result;
    if (role === "admin") {
      result = signInAdmin({ user_type: "admin", email: identifier, password });
    } else if (role === "teacher") {
      result = signInTrainer({ user_type: "trainer", email: identifier, password });
    } else {
      result = signInStudent({ user_type: "student", cnic: identifier, password });
    }
    setLoading(false);
    if (result.error) {
      he(result.error || "Something went wrong", "error");
      return;
    }
    he(role === "student" ? "Logged in!" : "Login successfully", "success");
    if (role === "admin") navigate("/admin");
    else if (role === "teacher") navigate("/trainer/dashboard");
    else navigate("/");
  };

  useEffect(() => {
    if (tokenRef.current) return;
    tokenRef.current = true;
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      const result = signInStudent({ token });
      if (!result.error) {
        he("Logged in!", "success");
        navigate("/");
      }
    }
  }, [navigate, signInStudent]);

  return (
    <div className="min-h-screen w-full flex flex-col gap-3 items-center p-4 pt-10 h-full overflow-y-auto bg-white dark:bg-[#141414]">
      <div>
        <img className="mr-auto ml-auto" width={120} src={LOGO} alt="" />
        <p className="fw-bold text-center">{preset.portal}</p>
      </div>
      <div className="w-full max-w-[400px]">
        <div className="grid w-full grid-cols-2 gap-1 rounded-md bg-muted p-1">
          <button
            type="button"
            onClick={() => selectRole("student")}
            className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
              role === "student"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => selectRole("teacher")}
            className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
              role === "teacher"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Teacher
          </button>
        </div>
        <Card className="shadow-none mt-2">
          <CardHeader>
            <CardTitle>{preset.title}</CardTitle>
            <CardDescription>{preset.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 shadow-none">
            <div className="space-y-1">
              <Label htmlFor="identifier">{preset.idLabel}</Label>
              <Input
                id="identifier"
                type={preset.idType}
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && submit()}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && submit()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              onClick={submit}
              disabled={loading}
              className="w-full bg-clr_navy hover:bg-clr_blue_darker"
            >
              {loading ? <Spinner className="" /> : "LOGIN"}
            </Button>
          </CardFooter>
        </Card>
        <div className="grid w-full grid-cols-1 gap-1 rounded-md bg-muted p-1 mt-2">
          <button
            type="button"
            onClick={() => selectRole("admin")}
            className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
              role === "admin"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
}

export function TrainerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signInTrainer } = useApp();

  const finish = (user) => {
    he("Login successfully", "success");
    setEmail("");
    setPassword("");
    setCode("");
    setTwoFactor(false);
    navigate("/trainer/dashboard");
  };

  const submit = () => {
    if (!email.trim() || !password.trim()) return he("Please fill the required fields", "error");
    setLoading(true);
    const result = signInTrainer({ email, password, user_type: "trainer" });
    setLoading(false);
    if (result.error) {
      he(result.error || "Something went wrong", "error");
      return;
    }
    finish(result.user);
  };

  return (
    <div className="min-h-screen w-full flex flex-col gap-3 items-center p-4 pt-10 h-full overflow-y-auto">
      <div>
        <img className="mx-auto" width={120} src={LOGO} alt="" />
        <p className="fw-bold text-center">Trainer Portal</p>
      </div>
      <Tabs defaultValue="login" className="max-w-[400px]">
        <TabsContent value="login">
          {twoFactor ? (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#285192]" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>
                  Enter the 6-digit code from your authenticator app. You can also use one of your recovery codes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 shadow-none">
                <div className="space-y-1">
                  <Label htmlFor="code">Authentication code *</Label>
                  <Input
                    id="code"
                    value={code}
                    inputMode="text"
                    autoComplete="one-time-code"
                    placeholder="123456"
                    onChange={(event) => setCode(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && he("Invalid code", "error")}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-2">
                <Button disabled className="w-full bg-[#285192] hover:bg-blue-900">
                  VERIFY
                </Button>
                <button
                  type="button"
                  onClick={() => setTwoFactor(false)}
                  className="mt-1 flex items-center gap-1 text-sm text-blue-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
                >
                  Back to login
                </button>
              </CardFooter>
            </Card>
          ) : (
            <>
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Kindly provide your email and password to access the trainer portal.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 shadow-none">
                  <div className="space-y-1">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      type="email"
                      onKeyDown={(event) => event.key === "Enter" && submit()}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        type={showPassword ? "text" : "password"}
                        onKeyDown={(event) => event.key === "Enter" && submit()}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-2">
                  <Button disabled={loading} onClick={submit} className="w-full bg-[#285192] hover:bg-blue-900">
                    {loading ? <Spinner /> : "LOGIN"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => navigate("/trainer/login/reset-password")}
                    className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
                  >
                    Forgot Password?
                  </button>
                </CardFooter>
              </Card>
              <Button
                onClick={() => navigate("/login")}
                className="w-full my-2 bg-white shadow-sm hover:bg-gray-100 text-black border"
              >
                Login as student
              </Button>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const send = () => {
    if (!email.trim()) return he("Email is required", "error");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      he("Reset link sent to your email", "success");
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
      <img src={LOGO} alt="" className="w-24 mb-4" />
      {!sent ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>Enter your trainer email and we’ll send you a link to reset your password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              placeholder="trainer@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && send()}
            />
          </CardContent>
          <CardFooter>
            <Button disabled={loading} onClick={send} className="w-full bg-[#285192] hover:bg-blue-900">
              {loading ? <Spinner /> : "Send Reset Link"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <Shield className="h-10 w-10 mx-auto text-[#3363b1]" />
            <CardTitle>Your link is on its way!</CardTitle>
            <CardDescription>
              We’ve sent a password reset link to <strong>{email}</strong>. Check inbox/spam.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full bg-[#285192]" onClick={() => window.open("https://mail.google.com")}>
              Check Your Email
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
            >
              Send Again
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (password.length < 6) return he("Password must be at least 6 characters", "error");
    if (confirm.length < 6) return he("Confirm password must be at least 6 characters", "error");
    if (password !== confirm) return he("Passwords do not match", "error");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      he("Password reset successful", "success");
      navigate("/trainer/login");
    }, 400);
    return token;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
      <img src={LOGO} alt="" className="w-24 mb-4" />
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-1">Reset Password</h2>
        <p className="text-sm text-muted-foreground mb-4">Enter your new trainer password below.</p>
        <div className="space-y-3">
          <div className="relative">
            <Label>New Password</Label>
            <Input type={show ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} />
            <button type="button" className="absolute right-3 top-8" onClick={() => setShow((value) => !value)}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="relative">
            <Label>Confirm Password</Label>
            <Input type={show2 ? "text" : "password"} value={confirm} onChange={(event) => setConfirm(event.target.value)} />
            <button type="button" className="absolute right-3 top-8" onClick={() => setShow2((value) => !value)}>
              {show2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Button className="w-full bg-[#285192] hover:bg-blue-900" onClick={submit}>
            {loading ? "Resetting…" : "Reset Password"}
          </Button>
          <p className="text-sm text-center">
            Remembered your password?{" "}
            <button type="button" className="text-blue-600" onClick={() => navigate("/trainer/login")}>
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
