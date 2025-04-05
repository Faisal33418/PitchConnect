const adminSchema = [
  // { name: '_id', label: 'Id', type: 'text' },
  { name: "fullName", label: "Full Name", type: "text" },
  // { name: 'email', label: 'Email', type: 'email' },
  { name: "status", label: "Status", type: "text" },
  { name: "profilePicture", label: "Profile Picture", type: "file" },
];

const authSchema = [
  { name: "fullName", label: "Full Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { role: "role", label: "Role", type: "text" },
  { role: "status", label: "Status", type: "text" },
];

const investorSchema = [
  // { name: '_id', label: 'Id', type: 'text' },
  { name: "fullName", label: "Full Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phoneNumber", label: "Phone Number", type: "number" },
  { name: "profilePicture", label: "Profile Picture", type: "file" },
  { name: "companyName", label: "Company Name", type: "text" },
  { name: "industryInterest", label: "Industries of Interest", type: "text" },
  { name: "Bios", label: "Bios", type: "text" },
  { name: "skills", label: "Skills/Expertise", type: "text" },
  { name: "location", label: "Location", type: "text" },
  {
    name: "startupStagePreference",
    label: "Startup Stage Preference",
    type: "text",
  },
  {
    name: "investmentAmountRange",
    label: "Investment Amount Range",
    type: "text",
  },
  {
    name: "geographicalPreference",
    label: "Geographical Preference",
    type: "text",
  },
  { name: "typeOfInvestment", label: "Type of Investment", type: "text" },
  { name: "investmentGoals", label: "Investment Goals", type: "text" },
  { name: "investmentHistory", label: "Investment History", type: "text" },
];

const entrepreneurSchema = [
  // { name: '_id', label: 'Id', type: 'text' },
  { name: "fullName", label: "Full Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phoneNumber", label: "Phone Number", type: "number" },
  { name: "profilePicture", label: "Profile Picture", type: "file" },
  { name: "location", label: "Location", type: "text" },
  { name: "industry", label: "Industry", type: "text" },
  { name: "Bios", label: "Bios", type: "text" },
  { name: "skills", label: "Skills/Expertise", type: "text" },
];

const companyProfile = [
  { name: "pitchTitle", label: "Pitch Title", type: "text" },
  { name: "shortSummary", label: "Short Summary", type: "text" },
  { name: "website", label: "Website", type: "text" },
  { name: "companyBased", label: "Company Based", type: "text" },
  { name: "industry", label: "Industry", type: "text" },
  { name: "stage", label: "Stage", type: "text" },
  { name: "ideaInvestorRole", label: "Ideal Investor  Role", type: "text" },
  { name: "investmentRange", label: "Investment Range", type: "text" },
  { name: "previousRoundRaise", label: "Previous Round Raise", type: "text" },
  { name: "entrepreneurId", label: "Entrepreneur", type: "text" },
];

const videoImage = [
  { name: "logoBanner", label: "Banner Image", type: "file" },
  { name: "video", label: "Video", type: "file" },
];

const businessDocuments = [
  { name: "title", label: "Documents Title", type: "text" },
  { name: "documents", label: "Upload Documents", type: "file" },
];
export {
  adminSchema,
  authSchema,
  investorSchema,
  entrepreneurSchema,
  companyProfile,
  videoImage,
  businessDocuments,
};
