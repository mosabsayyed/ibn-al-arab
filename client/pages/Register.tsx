import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useI18n } from "@/context/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, locale } = useI18n();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isStudent: false,
    universityEmail: "",
    studentIdExpiry: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const returnTo = searchParams.get('returnTo') || '/';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError(t("firstNameRequired"));
      return false;
    }
    if (!formData.lastName.trim()) {
      setError(t("lastNameRequired"));
      return false;
    }
    if (!formData.email.trim()) {
      setError(t("emailRequired"));
      return false;
    }
    if (!formData.phone.trim()) {
      setError(t("phoneRequired"));
      return false;
    }
    // E.164 phone format check
    const e164Regex = /^\+[1-9]\d{1,14}$/
    if (!e164Regex.test(formData.phone.trim())) {
      setError(t('phoneE164Error'));
      return false;
    }
    if (formData.password.length < 6) {
      setError(t("passwordMinLength"));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return false;
    }
    if (formData.isStudent && !formData.universityEmail.trim()) {
      setError(t("universityEmailRequired"));
      return false;
    }
    if (formData.isStudent && !formData.studentIdExpiry.trim()) {
      setError(t("studentIdExpiryRequired"));
      return false;
    }
    if (!acceptTerms) {
      setError(t("acceptTermsRequired"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    
    const profileData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim(),
      isStudent: formData.isStudent,
      universityEmail: formData.isStudent ? formData.universityEmail.trim() : null,
      studentIdExpiry: formData.isStudent ? formData.studentIdExpiry : null
    };
    
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    const res = await register(formData.email, formData.password, fullName, profileData);
    setLoading(false);
    
    if (res.error) {
      setError(res.error);
    } else if (res.needsConfirmation) {
      setNeedsConfirmation(true);
    } else {
      navigate(returnTo);
    }
  };

  if (needsConfirmation) {
    return (
      <main className="container py-16 max-w-lg mx-auto">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-700">{t("checkYourEmail")}</h1>
          <p className="text-gray-600">
            {t("confirmationEmailSentTo")} <strong>{formData.email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            {t("clickLinkToActivate")}
          </p>
          <Button
            onClick={() => navigate("/")} 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {t("backToHome")}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className={`container py-16 max-w-lg mx-auto ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("createAccount")}</h1>
        <p className="text-gray-600">{t("joinIbnAlArab")}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("firstName")}</label>
          <Input
            className="mt-1 block w-full"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            type="text"
            placeholder={t("enterFirstName")}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("lastName")}</label>
          <Input
            className="mt-1 block w-full"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            type="text"
            placeholder={t("enterLastName")}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("emailAddress")}</label>
          <Input
            className="mt-1 block w-full"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            type="email"
            placeholder={t("enterEmail")}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("phoneNumber")}</label>
          <Input
            className={`mt-1 block w-full ${locale === 'ar' ? 'text-right' : ''}`}
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            type="tel"
            placeholder={t("enterPhoneNumber")}
            required
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          />
          <p className="text-xs text-gray-500 mt-1">{t('phoneFormatHint')}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("password")}</label>
          <Input
            className="mt-1 block w-full"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            type="password"
            placeholder={t("createPassword")}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("confirmPassword")}</label>
          <Input
            className="mt-1 block w-full"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            type="password"
            placeholder={t("confirmYourPassword")}
            required
          />
        </div>

        {/* Student Information Section */}
        <div className="border-t pt-6">
          <div className="flex items-start mb-4">
            <Checkbox
              id="is-student"
              checked={formData.isStudent}
              onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isStudent: !!checked }))}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="is-student" className="ml-2 block text-sm font-medium text-gray-700">
              {t("iAmAStudent")}
            </label>
          </div>

          {formData.isStudent && (
            <div className="space-y-4 ml-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("universityEmail")}</label>
                <Input
                  className="mt-1 block w-full"
                  name="universityEmail"
                  value={formData.universityEmail}
                  onChange={handleInputChange}
                  type="email"
                  placeholder={t("enterUniversityEmail")}
                  required={formData.isStudent}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("studentIdExpiry")}</label>
                <Input
                  className="mt-1 block w-full"
                  name="studentIdExpiry"
                  value={formData.studentIdExpiry}
                  onChange={handleInputChange}
                  type="date"
                  placeholder={t("enterStudentIdExpiry")}
                  required={formData.isStudent}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-start">
          <Checkbox
            id="accept-terms"
            checked={acceptTerms}
            onCheckedChange={(checked: boolean) => setAcceptTerms(checked)}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-700">
            {t("iAgreeToThe")}{" "}
            <Link to="/terms" className="text-red-600 hover:text-red-700 underline">
              {t("termsAndConditions")}
            </Link>{" "}
            {t("and")}{" "}
            <Link to="/privacy" className="text-red-600 hover:text-red-700 underline">
              {t("privacyPolicy")}
            </Link>
          </label>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="text-sm text-red-600">{error}</div>
          </div>
        )}
        
        <div>
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("creatingAccount")}
              </div>
            ) : (
              t("createAccountButton")
            )}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {t("haveAccount")}{" "}
          <Link to={`/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`} className="font-medium text-red-600 hover:text-red-700 underline">
            {t("clickToSignIn")}
          </Link>
        </p>
      </div>
    </main>
  );
}
