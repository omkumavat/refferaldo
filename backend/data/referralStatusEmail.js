export const referralStatusMessages = {
  new: {
    emailHeading: "Your referral request has been received!",
    statusLabel: "Submitted",
    emailMessage:
      "Hi {{candidateName}}, your application for {{jobTitle}} at {{companyName}} has been successfully received on Refermy.life. Your submitted details are now available for review by the employee who created this referral form.",
    encouragementMessage:
      "Thank you for taking the next step in your career. Make sure your profile and resume are up to date while you wait for an update."
  },

  reviewing: {
    emailHeading: "Your profile is being reviewed",
    statusLabel: "Under Review",
    emailMessage:
      "Good news, {{candidateName}}! Your profile and application for {{jobTitle}} at {{companyName}} are being reviewed by {{employeeName}}. The employee is evaluating your experience, skills, resume, and submitted responses to decide whether to proceed with a referral.",
    encouragementMessage:
      "This is an opportunity to showcase your strengths. Keep your professional profile updated and continue exploring other relevant opportunities while the review is in progress."
  },

  shortlisted: {
    emailHeading: "Great news! You've been shortlisted",
    statusLabel: "Shortlisted",
    emailMessage:
      "Congratulations, {{candidateName}}! Your profile for {{jobTitle}} at {{companyName}} has been shortlisted by {{employeeName}} for further consideration. Your application has progressed to the next stage of the referral process.",
    encouragementMessage:
      "Take a moment to celebrate this progress! Keep your resume ready, review the role requirements, and watch for further updates. Shortlisting is a positive step, but it does not guarantee an interview or job offer."
  },

  rejected: {
    emailHeading: "An update on your referral application",
    statusLabel: "Not Selected",
    emailMessage:
      "Hi {{candidateName}}, thank you for your interest in {{jobTitle}} at {{companyName}}. After reviewing your profile and application, the employee has decided not to proceed with a referral for this opportunity. We understand this may be disappointing.",
    encouragementMessage:
      "One outcome does not define your potential. Every application is a chance to learn, improve, and move closer to the right opportunity. Continue strengthening your skills, refining your resume, and applying for roles that match your interests. Your next opportunity could be just around the corner."
  },

  referred: {
    emailHeading: "Your profile has been referred!",
    statusLabel: "Referred",
    emailMessage:
      "Congratulations, {{candidateName}}! {{employeeName}} has marked your profile as referred for {{jobTitle}} at {{companyName}}. This means your profile has progressed beyond the initial review and has been marked as referred in the platform.",
    encouragementMessage:
      "Keep an eye on your email and dashboard for further updates. Make sure your contact details and resume are current so you are prepared if the employer reaches out. The employer controls the next steps, including interview selection and hiring decisions."
  },

  hired: {
    emailHeading: "Congratulations on your new opportunity!",
    statusLabel: "Hired",
    emailMessage:
      "Amazing news, {{candidateName}}! Your application for {{jobTitle}} at {{companyName}} has been marked as hired. This is a wonderful milestone, and we are delighted that your referral journey has reached this stage.",
    encouragementMessage:
      "Congratulations on this achievement! Thank you for using Refermy.life to connect with professional opportunities. We wish you every success in your next career chapter."
  }
};