import { FieldType, FormType, Prisma } from '@prisma/client';

// Define the FieldProperties interface for field-specific properties (e.g., validation rules)
export interface FieldProperties extends Record<string, any>  {
  // Validation rules for text inputs (SHORT_TEXT, LONG_TEXT, EMAIL, PHONE, URL, NUMBER)
  minLength?: number; // Minimum length for text inputs
  maxLength?: number; // Maximum length for text inputs
  pattern?: string; // Regex pattern for validation (e.g., email format)
  placeholder?: string; // Placeholder text for input fields
  defaultValue?: string | number; // Default value for the field

  // For NUMBER fields
  minValue?: number; // Minimum value for numeric inputs
  maxValue?: number; // Maximum value for numeric inputs

  // For FILE_UPLOAD and IMAGE_UPLOAD
  allowedFileTypes?: string[]; // e.g., ['pdf', 'jpg', 'png']
  maxFileSize?: number; // Maximum file size in bytes
  multiple?: boolean; // Allow multiple files

  // For RATING and OPINION_SCALE
  maxRating?: number; // e.g., 5 for 5-star rating
  scaleLabels?: { value: number; label: string }[]; // Labels for opinion scale

  // For PAYMENT fields
  currency?: string; // e.g., 'USD', 'EUR'
  amount?: number; // Fixed payment amount
}

// Define the FieldLogic interface for conditional logic (e.g., show/hide conditions)
export interface FieldLogic extends Record<string, any>  {
  conditions: Array<{
    fieldId: string; // ID of the field to base the condition on
    operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'GREATER_THAN' | 'LESS_THAN';
    value: string | number | boolean; // Value to compare against
    action: 'SHOW' | 'HIDE'; // Action to take if condition is met
    targetFieldId: string; // ID of the field to show/hide
  }>;
  branching?: {
    nextFieldId?: string; // ID of the next field to jump to
    endForm?: boolean; // End the form if condition is met
  };
}

// Define the FormTheme interface for form appearance (colors, fonts, background)
export interface FormTheme extends Record<string, any>  {
  primaryColor?: string; // e.g., '#007bff' (hex code)
  secondaryColor?: string; // e.g., '#6c757d'
  backgroundColor?: string; // e.g., '#ffffff'
  textColor?: string; // e.g., '#333333'
  fontFamily?: string; // e.g., 'Roboto, sans-serif'
  fontSize?: number; // Base font size in pixels
  borderRadius?: number; // Border radius for inputs/buttons in pixels
  backgroundImage?: string; // URL for background image
  customCSS?: string; // Custom CSS styles
}

// Define the FormSettings interface for form behavior (notifications, redirects, etc.)
export interface FormSettings extends Record<string, any>  {
  notifications?: {
    email?: {
      enabled: boolean;
      recipients: string[]; // Email addresses to notify
      subject?: string; // Notification email subject
      bodyTemplate?: string; // Custom email body template
    };
    slack?: {
      enabled: boolean;
      webhookUrl: string; // Slack webhook URL
    };
  };
  redirectUrl?: string; // URL to redirect after submission
  submitButtonText?: string; // Custom text for submit button
  allowMultipleSubmissions?: boolean; // Allow respondents to submit multiple times
  successMessage?: string; // Message shown after successful submission
  errorMessage?: string; // Message shown on submission error
}

// Define the FormQuizSettings interface for quiz-specific settings
export interface FormQuizSettings extends Record<string, any>  {
  scoring: {
    enabled: boolean;
    passScore: number; // Percentage or points required to pass (0-100)
    showScoreAfterSubmission: boolean; // Display score to respondent
  };
  resultsDisplay: {
    showCorrectAnswers: boolean; // Show correct answers after submission
    showExplanations: boolean; // Show explanations for answers
    customResultMessage?: string; // Custom message based on score
  };
  timeLimit?: number; // Time limit for quiz in seconds
  shuffleQuestions?: boolean; // Randomize question order
  shuffleOptions?: boolean; // Randomize option order for multiple-choice questions
}

// Define the FormPollSettings interface for poll-specific settings
export interface FormPollSettings extends Record<string, any>  {
  allowMultipleResponses: boolean; // Allow multiple responses from same user
  showRealTimeResults: boolean; // Display results in real-time
  resultsVisibility: 'PUBLIC' | 'PRIVATE' | 'AFTER_VOTE'; // When to show results
  voteLimit?: number; // Maximum votes allowed per respondent
  anonymizeResponses?: boolean; // Hide respondent info
}

// Define the TemplateStructure type for the Template model's structure field
export interface TemplateStructure extends Record<string, any>  {
  fields: Array<{
    title: string;
    description?: string;
    type: FieldType;
    required?: boolean;
    order: number;
    properties?: FieldProperties;
    correctAnswer?: string;
    points?: number;
    explanation?: string;
    logic?: FieldLogic;
    options?: Array<{
      order: number;
      label: string;
      isCorrect?: boolean;
    }>;
  }>;
  theme?: FormTheme;
  settings?: FormSettings;
  quizSettings?: FormQuizSettings;
  pollSettings?: FormPollSettings;
  type: FormType;
}