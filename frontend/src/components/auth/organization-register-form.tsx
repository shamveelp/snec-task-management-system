"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PasswordInput } from "../ui/password-input";
import { Loader2, CheckCircle } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../../store/auth.store";
import { useRouter } from "next/navigation";

const ORG_CATEGORIES = [
  "Technology",
  "Healthcare",
  "Education",
  "Finance",
  "Retail",
  "Other"
];

export function OrganizationRegisterForm() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = React.useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    category: ORG_CATEGORIES[0],
    password: "",
  });

  const [validation, setValidation] = React.useState({
    username: { isChecking: false, error: "" },
    email: { isChecking: false, error: "" },
  });

  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [countryCode, setCountryCode] = React.useState("+91");
  const [countrySearch, setCountrySearch] = React.useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = React.useState(false);

  // OTP State
  const [isOtpDialogOpen, setIsOtpDialogOpen] = React.useState(false);
  const [otpValue, setOtpValue] = React.useState("");
  const [otpError, setOtpError] = React.useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = React.useState(false);
  const [resendTimer, setResendTimer] = React.useState(60);
  const [isResending, setIsResending] = React.useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpDialogOpen && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpDialogOpen, resendTimer]);

  const countries = [
    { name: "Afghanistan", flag: "🇦🇫", code: "+93" },
    { name: "Albania", flag: "🇦🇱", code: "+355" },
    { name: "Algeria", flag: "🇩🇿", code: "+213" },
    { name: "Andorra", flag: "🇦🇩", code: "+376" },
    { name: "Angola", flag: "🇦🇴", code: "+244" },
    { name: "Argentina", flag: "🇦🇷", code: "+54" },
    { name: "Armenia", flag: "🇦🇲", code: "+374" },
    { name: "Australia", flag: "🇦🇺", code: "+61" },
    { name: "Austria", flag: "🇦🇹", code: "+43" },
    { name: "Azerbaijan", flag: "🇦🇿", code: "+994" },
    { name: "Bahrain", flag: "🇧🇭", code: "+973" },
    { name: "Bangladesh", flag: "🇧🇩", code: "+880" },
    { name: "Belarus", flag: "🇧🇾", code: "+375" },
    { name: "Belgium", flag: "🇧🇪", code: "+32" },
    { name: "Brazil", flag: "🇧🇷", code: "+55" },
    { name: "Bulgaria", flag: "🇧🇬", code: "+359" },
    { name: "Canada", flag: "🇨🇦", code: "+1" },
    { name: "Chile", flag: "🇨🇱", code: "+56" },
    { name: "China", flag: "🇨🇳", code: "+86" },
    { name: "Colombia", flag: "🇨🇴", code: "+57" },
    { name: "Croatia", flag: "🇭🇷", code: "+385" },
    { name: "Cyprus", flag: "🇨🇾", code: "+357" },
    { name: "Czechia", flag: "🇨🇿", code: "+420" },
    { name: "Denmark", flag: "🇩🇰", code: "+45" },
    { name: "Egypt", flag: "🇪🇬", code: "+20" },
    { name: "Estonia", flag: "🇪🇪", code: "+372" },
    { name: "Finland", flag: "🇫🇮", code: "+358" },
    { name: "France", flag: "🇫🇷", code: "+33" },
    { name: "Georgia", flag: "🇬🇪", code: "+995" },
    { name: "Germany", flag: "🇩🇪", code: "+49" },
    { name: "Greece", flag: "🇬🇷", code: "+30" },
    { name: "Hong Kong", flag: "🇭🇰", code: "+852" },
    { name: "Hungary", flag: "🇭🇺", code: "+36" },
    { name: "Iceland", flag: "🇮🇸", code: "+354" },
    { name: "India", flag: "🇮🇳", code: "+91" },
    { name: "Indonesia", flag: "🇮🇩", code: "+62" },
    { name: "Iran", flag: "🇮🇷", code: "+98" },
    { name: "Iraq", flag: "🇮🇶", code: "+964" },
    { name: "Ireland", flag: "🇮🇪", code: "+353" },
    { name: "Israel", flag: "🇮🇱", code: "+972" },
    { name: "Italy", flag: "🇮🇹", code: "+39" },
    { name: "Japan", flag: "🇯🇵", code: "+81" },
    { name: "Jordan", flag: "🇯🇴", code: "+962" },
    { name: "Kazakhstan", flag: "🇰🇿", code: "+7" },
    { name: "Kenya", flag: "🇰🇪", code: "+254" },
    { name: "Kuwait", flag: "🇰🇼", code: "+965" },
    { name: "Lebanon", flag: "🇱🇧", code: "+961" },
    { name: "Malaysia", flag: "🇲🇾", code: "+60" },
    { name: "Maldives", flag: "🇲🇻", code: "+960" },
    { name: "Mexico", flag: "🇲🇽", code: "+52" },
    { name: "Morocco", flag: "🇲🇦", code: "+212" },
    { name: "Nepal", flag: "🇳🇵", code: "+977" },
    { name: "Netherlands", flag: "🇳🇱", code: "+31" },
    { name: "New Zealand", flag: "🇳🇿", code: "+64" },
    { name: "Nigeria", flag: "🇳🇬", code: "+234" },
    { name: "Norway", flag: "🇳🇴", code: "+47" },
    { name: "Oman", flag: "🇴🇲", code: "+968" },
    { name: "Pakistan", flag: "🇵🇰", code: "+92" },
    { name: "Peru", flag: "🇵🇪", code: "+51" },
    { name: "Philippines", flag: "🇵🇭", code: "+63" },
    { name: "Poland", flag: "🇵🇱", code: "+48" },
    { name: "Portugal", flag: "🇵🇹", code: "+351" },
    { name: "Qatar", flag: "🇶🇦", code: "+974" },
    { name: "Romania", flag: "🇷🇴", code: "+40" },
    { name: "Russia", flag: "🇷🇺", code: "+7" },
    { name: "Saudi Arabia", flag: "🇸🇦", code: "+966" },
    { name: "Singapore", flag: "🇸🇬", code: "+65" },
    { name: "South Africa", flag: "🇿🇦", code: "+27" },
    { name: "South Korea", flag: "🇰🇷", code: "+82" },
    { name: "Spain", flag: "🇪🇸", code: "+34" },
    { name: "Sri Lanka", flag: "🇱🇰", code: "+94" },
    { name: "Sweden", flag: "🇸🇪", code: "+46" },
    { name: "Switzerland", flag: "🇨🇭", code: "+41" },
    { name: "Taiwan", flag: "🇹🇼", code: "+886" },
    { name: "Thailand", flag: "🇹🇭", code: "+66" },
    { name: "Turkey", flag: "🇹🇷", code: "+90" },
    { name: "Ukraine", flag: "🇺🇦", code: "+380" },
    { name: "United Arab Emirates", flag: "🇦🇪", code: "+971" },
    { name: "United Kingdom", flag: "🇬🇧", code: "+44" },
    { name: "United States", flag: "🇺🇸", code: "+1" },
    { name: "Vietnam", flag: "🇻🇳", code: "+84" }
  ];

  const filteredCountries = countries.filter(
    (c) => c.code.includes(countrySearch) || c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Debounced validation for username
  React.useEffect(() => {
    const checkUsername = async () => {
      if (!formData.username) {
        setValidation(prev => ({ ...prev, username: { isChecking: false, error: "" } }));
        return;
      }
      setValidation(prev => ({ ...prev, username: { ...prev.username, isChecking: true, error: "" } }));
      try {
        const { data } = await axios.get(`http://localhost:5000/organizations/check-username?username=${formData.username.trim()}`);
        if (!data.isAvailable) {
          setValidation(prev => ({ ...prev, username: { isChecking: false, error: "Username is already taken" } }));
        } else {
          setValidation(prev => ({ ...prev, username: { isChecking: false, error: "" } }));
        }
      } catch (err) {
        setValidation(prev => ({ ...prev, username: { isChecking: false, error: "Error checking username" } }));
      }
    };
    
    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  // Debounced validation for email
  React.useEffect(() => {
    const checkEmail = async () => {
      if (!formData.email) {
        setValidation(prev => ({ ...prev, email: { isChecking: false, error: "" } }));
        return;
      }
      setValidation(prev => ({ ...prev, email: { ...prev.email, isChecking: true, error: "" } }));
      try {
        const { data } = await axios.get(`http://localhost:5000/organizations/check-email?email=${formData.email.trim()}`);
        if (!data.isAvailable) {
          setValidation(prev => ({ ...prev, email: { isChecking: false, error: "Email is already registered" } }));
        } else {
          setValidation(prev => ({ ...prev, email: { isChecking: false, error: "" } }));
        }
      } catch (err) {
        setValidation(prev => ({ ...prev, email: { isChecking: false, error: "Error checking email" } }));
      }
    };
    
    const timeoutId = setTimeout(checkEmail, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validation.username.error || validation.email.error) {
      setError("Please fix the validation errors before submitting.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // Step 1: Request OTP
      await axios.post("http://localhost:5000/organizations/send-otp", {
        email: formData.email.trim()
      });
      setResendTimer(60);
      setIsOtpDialogOpen(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError("");
    setIsResending(true);
    try {
      await axios.post("http://localhost:5000/organizations/send-otp", {
        email: formData.email.trim()
      });
      setResendTimer(60);
    } catch (err: any) {
      setOtpError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length < 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    setOtpError("");
    setIsVerifyingOtp(true);

    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        mobile: `${countryCode}${formData.mobile.trim()}`,
        otp: otpValue
      };
      
      // Step 2: Register Organization with OTP
      await axios.post("http://localhost:5000/organizations/register", payload);
      
      // Auto login
      await login({ email: payload.username, password: formData.password });
      router.push("/organization/dashboard");
    } catch (err: any) {
      setOtpError(err?.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Register Organization</h1>
        <p className="text-sm text-muted-foreground">
          Create your organization and admin account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium border border-destructive/20">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="name">Organization Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Enter organization name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Organization Username</Label>
          <div className="relative">
            <Input
              id="username"
              name="username"
              type="text"
              required
              className={`${validation.username.error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              placeholder="Choose a unique username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={isSubmitting}
            />
            {validation.username.isChecking && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
            )}
            {!validation.username.isChecking && !validation.username.error && formData.username && (
              <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-emerald-500" />
            )}
          </div>
          {validation.username.error && (
            <p className="text-xs font-medium text-red-500 mt-1">{validation.username.error}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Organization Email</Label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              required
              className={`${validation.email.error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              placeholder="organization@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isSubmitting}
            />
            {validation.email.isChecking && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
            )}
            {!validation.email.isChecking && !validation.email.error && formData.email && (
              <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-emerald-500" />
            )}
          </div>
          {validation.email.error && (
            <p className="text-xs font-medium text-red-500 mt-1">{validation.email.error}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number</Label>
          <div className="flex gap-2 relative">
            <button
              type="button"
              className="flex h-9 w-[100px] items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              disabled={isSubmitting}
            >
              <span>{countries.find(c => c.code === countryCode)?.flag || "🇮🇳"} {countryCode}</span>
            </button>
            
            {isCountryDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-0" 
                  onClick={() => setIsCountryDropdownOpen(false)}
                />
                <div className="absolute z-10 top-10 left-0 w-[250px] rounded-md border border-input bg-background shadow-md overflow-hidden">
                  <div className="p-2 border-b border-input bg-background relative z-10">
                    <Input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="Search country..."
                      className="h-8 text-sm w-full"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-auto bg-background relative z-10">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <div
                          key={country.name}
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-muted flex items-center gap-2"
                          onClick={() => {
                            setCountryCode(country.code);
                            setIsCountryDropdownOpen(false);
                            setCountrySearch("");
                          }}
                        >
                          <span className="text-lg">{country.flag}</span>
                          <span className="truncate">{country.name}</span>
                          <span className="text-muted-foreground ml-auto whitespace-nowrap">{country.code}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground text-center">No results</div>
                    )}
                  </div>
                </div>
              </>
            )}
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              required
              className="flex-1"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            required
            className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            disabled={isSubmitting}
          >
            {ORG_CATEGORIES.map(cat => (
              <option key={cat} value={cat} className="bg-background text-foreground">{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Admin Password</Label>
          <PasswordInput
            id="password"
            name="password"
            required
            minLength={6}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        <Button
          type="submit"
          className="w-full mt-6"
          disabled={isSubmitting || !!validation.username.error || !!validation.email.error}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            "Register & Login"
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an organization?{" "}
        <Link href="/organization/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {isOtpDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => !isVerifyingOtp && setIsOtpDialogOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg z-10"
            >
              <div className="text-center mb-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Verify your email</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  We've sent a 6-digit verification code to <span className="font-medium text-foreground">{formData.email}</span>
                </p>
              </div>

              <form onSubmit={handleOtpVerify} className="space-y-4">
                {otpError && (
                  <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium border border-destructive/20 text-center">
                    {otpError}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="otp" className="sr-only">One-Time Password</Label>
                  <Input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    className="text-center text-2xl tracking-widest h-12"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                    disabled={isVerifyingOtp}
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsOtpDialogOpen(false)}
                    disabled={isVerifyingOtp}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isVerifyingOtp || otpValue.length !== 6}
                  >
                    {isVerifyingOtp ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Verify & Register"
                    )}
                  </Button>
                </div>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?{" "}
                    {resendTimer > 0 ? (
                      <span className="text-muted-foreground font-medium">Resend in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isResending}
                        className="text-primary hover:underline font-medium focus:outline-none"
                      >
                        {isResending ? "Sending..." : "Resend OTP"}
                      </button>
                    )}
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
