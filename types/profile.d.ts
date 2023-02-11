export type UserProfile = [
  SelfInfo,
  ProjectInfo[],
  ProjectInfo[],
  ProjectInfo[],
  WorkExperience[],
  Education[],
  Skill[],
  FunFact[],
  Learning[],
  Certification[]
];

export type Certification = {
  key: "certification";
  name: string;
  image: string;
  description: string;
  link: string;
  reference: string;
};

export type Learning = {
  key: "learning";
  name: string;
  description: string;
  link: string;
};

export type SelfInfo = {
  key: "selfInfo";
  username: string;
  bio: string;
  image: string;
  followings: string[];
  followers: string[];
};

export type FunFact = {
  key: "funFact";
  fact: string;
};

export type Skill = {
  key: "skill";
  name: string;
  level: number;
};

export type Education = {
  key: "education";
  institute: string;
  degreeInitial: string;
  degreeFullName: string;
  location: string;
  country: string;
  website: string;
  startDate: Date;
  endDate: Date;
  yourMajor: string;
  impact: string;
};
export type ProjectInfo = {
  key: "pro-project" | "personal-project" | "research-project";
  name: string;
  descriptions: string[];
  images: string[];
  liveLink: string;
  githubLink: string;
};

export type WorkExperience = {
  key: "workExperience";
  company: string;
  position: string;
  location: string;
  country: string;
  website: string;
  startDate: Date;
  endDate: Date;
  descriptions: string[];
};
