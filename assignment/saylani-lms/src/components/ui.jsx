import * as React from "react";
import { cva } from "class-variance-authority";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Slot } from "@radix-ui/react-slot";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, MoreHorizontal, X } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground dark:border-[#3a3a3a] dark:bg-[#2a2a2a] dark:text-gray-200 dark:hover:bg-[#333333]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 dark:bg-[#2a2a2a] dark:text-gray-200 dark:hover:bg-[#333333]",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-[#2a2a2a] dark:text-gray-300",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export const Spinner = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("animate-spin", className)}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-[#3a3a3a] dark:bg-[#1e1e1e] dark:text-gray-200 dark:placeholder:text-gray-500",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  />
));
Label.displayName = "Label";

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...props} />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export const Tabs = TabsPrimitive.Root;
export const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

const AccordionContext = React.createContext(null);
const AccordionItemContext = React.createContext(null);

export function Accordion({ type = "multiple", value, onValueChange, className, children, ...props }) {
  const [uncontrolled, setUncontrolled] = React.useState([]);
  const openValues = value !== undefined ? value : uncontrolled;
  const setOpenValues = onValueChange || setUncontrolled;
  return (
    <AccordionContext.Provider value={{ type, openValues, setOpenValues }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export const AccordionItem = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const { openValues, setOpenValues, type } = React.useContext(AccordionContext);
  const open = (openValues || []).includes(value);
  const toggle = () => {
    const next = type === "multiple"
      ? open
        ? openValues.filter((item) => item !== value)
        : [...openValues, value]
      : open
        ? []
        : [value];
    setOpenValues(next);
  };
  return (
    <AccordionItemContext.Provider value={{ open, toggle, value }}>
      <div ref={ref} data-state={open ? "open" : "closed"} className={cn("border-b", className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
});
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, toggle } = React.useContext(AccordionItemContext);
  return (
    <div className="flex">
      <button
        ref={ref}
        type="button"
        data-state={open ? "open" : "closed"}
        className={cn(
          "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        onClick={toggle}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </button>
    </div>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open } = React.useContext(AccordionItemContext);
  if (!open) return null;
  return (
    <div
      ref={ref}
      data-state="open"
      className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
export const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
export const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
export const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;
export const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

export const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
export const AlertDialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
export const AlertDialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
export const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
export const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
export const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
export const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
export const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
export const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

export const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
export const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
export const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        warning: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        info: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        pending: "border-transparent bg-orange-100 text-orange-800 hover:bg-orange-200",
        completed: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        enrolled: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        not_enrolled: "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
        paid: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        expired: "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

const STATUS_COLORS = {
  pending: "bg-clr_amber_bg text-clr_amber_dark border-clr_amber_border hover:bg-clr_amber_hover",
  approved: "bg-clr_emerald_bg text-clr_emerald_dark border-clr_emerald_border hover:bg-clr_emerald_hover",
  completed: "bg-clr_emerald_bg text-clr_emerald_dark border-clr_emerald_border hover:bg-clr_emerald_hover",
  passed: "bg-clr_emerald_bg text-clr_emerald_dark border-clr_emerald_border hover:bg-clr_emerald_hover",
  submitted: "bg-clr_blue_bg text-clr_blue_dark border-clr_blue_border hover:bg-clr_blue_hover",
  rejected: "bg-clr_rose_bg_light text-clr_rose_dark border-clr_rose_border hover:bg-clr_rose_hover",
  cancelled: "bg-clr_rose_bg_light text-clr_rose_dark border-clr_rose_border hover:bg-clr_rose_hover",
  dropout: "bg-clr_rose_bg_light text-clr_rose_dark border-clr_rose_border hover:bg-clr_rose_hover",
  failed: "bg-clr_rose_bg_light text-clr_rose_dark border-clr_rose_border hover:bg-clr_rose_hover",
  eliminated: "bg-clr_rose_bg_light text-clr_rose_dark border-clr_rose_border hover:bg-clr_rose_hover",
  enrolled: "bg-clr_sky_bg text-clr_sky_dark border-clr_sky_border hover:bg-clr_sky_hover",
  certified: "bg-clr_emerald_bg text-clr_emerald_dark border-clr_emerald_border hover:bg-clr_emerald_hover",
  active: "bg-clr_green_bg text-clr_green_dark border-clr_green_border hover:bg-clr_green_hover",
  not_attempted: "bg-clr_sky_bg text-clr_sky_dark border-clr_sky_border hover:bg-clr_sky_hover",
  present: "bg-clr_green_bg text-clr_green_dark border-clr_green_border hover:bg-clr_green_hover",
  leave: "bg-clr_amber_bg text-clr_amber_dark border-clr_amber_border hover:bg-clr_amber_hover",
  absent: "bg-clr_red_bg text-clr_red_dark border-clr_red_border hover:bg-clr_red_hover",
  not_approved: "bg-clr_amber_bg text-clr_amber_dark border-clr_amber_border hover:bg-clr_amber_hover",
  late_submitted:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-900/50",
  hackathon: "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200",
  inactive: "bg-clr_red_bg text-clr_red_dark border-clr_red_border hover:bg-clr_red_hover",
  started: "bg-clr_sky_bg text-clr_sky_dark border-clr_sky_border hover:bg-clr_sky_hover",
  merged: "bg-clr_amber_bg text-clr_amber_dark border-clr_amber_border hover:bg-clr_amber_hover",
  not_submitted:
    "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700",
  paid: "bg-clr_emerald_bg text-clr_emerald_dark border-clr_emerald_border hover:bg-clr_emerald_hover",
  unpaid: "bg-clr_rose_bg_light text-clr_rose_dark border-clr_rose_border hover:bg-clr_rose_hover",
  default: "bg-clr_slate_bg text-clr_slate_dark border-clr_slate_border hover:bg-clr_slate_hover",
};

export const StatusBadge = ({ status = "default", className, children }) => {
  const key = String(status || "default");
  const colors = STATUS_COLORS[key] || STATUS_COLORS.default;
  return (
    <Badge variant="outline" className={`uppercase font-medium border ${colors} ${className || ""}`}>
      {children || key.replace(/_/g, " ")}
    </Badge>
  );
};

export function Skeleton({ className, ...props }) {
  return <div className={cn("animate-pulse rounded-md bg-primary/10 dark:bg-[#2a2a2a]", className)} {...props} />;
}

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;
export const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
export const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;
export const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:bg-[#222222] dark:border-[#2e2e2e]",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export function Calendar({ selected, onSelect, className }) {
  const [view, setView] = React.useState(() => (selected instanceof Date ? new Date(selected) : new Date()));
  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const cells = [];
  for (let i = 0; i < firstDay; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
  const isSameDay = (a, b) =>
    a instanceof Date && b instanceof Date && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const monthLabel = view.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  return (
    <div className={cn("p-3 w-[280px]", className)}>
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setView(new Date(year, month - 1, 1))}
          className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-input hover:bg-accent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">{monthLabel}</span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setView(new Date(year, month + 1, 1))}
          className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-input hover:bg-accent"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map((w) => (
          <div key={w} className="text-center text-xs font-medium text-muted-foreground">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, idx) => {
          if (!d) return <div key={`e${idx}`} />;
          const cellDate = new Date(year, month, d);
          const active = isSameDay(cellDate, selected);
          return (
            <button
              key={d}
              type="button"
              onClick={() => onSelect && onSelect(cellDate)}
              className={cn(
                "h-8 w-8 text-sm rounded-md inline-flex items-center justify-center hover:bg-accent",
                active && "bg-primary text-primary-foreground hover:bg-primary",
              )}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
));
Table.displayName = "Table";
export const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";
export const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";
export const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}
    {...props}
  />
));
TableRow.displayName = "TableRow";
export const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";
export const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";
export const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
));
AlertTitle.displayName = "AlertTitle";
export const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export const PageTitle = ({ title, subtitle, courseName }) => (
  <div className="flex items-center justify-between w-full px-2 mb-6 max-md:flex-col max-md:items-start max-md:gap-2">
    <div className="">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-gray-800 mt-1 max-md:mt-2">{subtitle}</p>}
    </div>
    <h2 className="text-1xl  tracking-tight">{courseName}</h2>
  </div>
);

export const AppBreadcrumb = ({ items }) => (
  <nav aria-label="breadcrumb">
    <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5 pt-4">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <li className="inline-flex items-center gap-1.5">
            {item.href ? (
              <Link to={item.href} className="transition-colors hover:text-foreground">
                {item.title}
              </Link>
            ) : (
              <span className={`transition-colors hover:text-foreground${index === items.length - 1 ? " font-semibold" : ""}`}>
                {item.title}
              </span>
            )}
          </li>
          {index < items.length - 1 && (
            <li role="presentation" aria-hidden="true" className="[&>svg]:w-3.5 [&>svg]:h-3.5">
              <ChevronRight className="h-4 w-4" />
            </li>
          )}
        </React.Fragment>
      ))}
    </ol>
  </nav>
);

export function PaginationBar({
  currentPage,
  totalPages,
  itemsCount,
  itemsPerPage,
  indexOfFirstItem,
  onPageChange,
  pageName = "records",
}) {
  if (!totalPages || totalPages <= 1) return null;
  const pages = [];
  if (totalPages <= 5) {
    for (let page = 1; page <= totalPages; page += 1) pages.push(page);
  } else {
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);
    pages.push(1);
    if (start > 2) pages.push("left-ellipsis");
    for (let page = start; page <= end; page += 1) {
      if (page !== 1 && page !== totalPages) pages.push(page);
    }
    if (end < totalPages - 1) pages.push("right-ellipsis");
    if (totalPages !== 1) pages.push(totalPages);
  }
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 pt-2 border-t">
      <div className="text-sm text-gray-600">
        Showing {itemsCount === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(currentPage * itemsPerPage, itemsCount)} of {itemsCount} {pageName}
      </div>
      <nav role="navigation" aria-label="pagination" className="mx-auto flex w-full justify-center md:justify-end">
        <ul className="flex flex-row items-center gap-1">
          <li>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "gap-1 pl-2.5",
                currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
          </li>
          {pages.map((page, index) =>
            page === "left-ellipsis" || page === "right-ellipsis" ? (
              <li key={`${page}-${index}`}>
                <span aria-hidden className="flex h-9 w-9 items-center justify-center">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More pages</span>
                </span>
              </li>
            ) : (
              <li key={page}>
                <button
                  type="button"
                  onClick={() => onPageChange(page)}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={cn(
                    buttonVariants({ variant: currentPage === page ? "outline" : "ghost", size: "icon" }),
                    "cursor-pointer",
                  )}
                >
                  {page}
                </button>
              </li>
            ),
          )}
          <li>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "gap-1 pr-2.5",
                currentPage === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              )}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <main className="px-0 py-8 sm:py-0 sm:pb-8 mx-auto">
      <div className="border rounded-xl pb-4 bg-white overflow-hidden">
        <div className="p-4 border-b">
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
        <div className="p-4 space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <div className="flex justify-end space-x-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export function BootSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-[#141414]">
      <Spinner className="h-8 w-8 text-gray-400 dark:text-gray-500" />
    </div>
  );
}
