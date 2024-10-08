export const suggestions: Record<string, string> = {
  "Product categories":
    "A list of product categories with image, name and description.",
  "Hero section":
    "A landing page hero section with a heading, leading text and an opt-in form.",
  "Contact form":
    "A contact form with first name, last name, email, and message fields. Put the form in a card with a submit button.",
  "Ecommerce dashboard":
    "An ecommerce dashboard with a sidebar navigation and a table of recent orders.",
};

const randomSuggestions = [
  "A personalized meal planning app based on dietary preferences",
  "A platform for sharing and discovering local hiking trails",
  "An online store for customizable tech accessories",
  "A community-driven marketplace for secondhand books",
  "A mobile game that teaches users about financial literacy",
  "A subscription service for themed mystery boxes",
  "A wellness app focused on mindfulness and meditation techniques",
  "A website that offers virtual museum tours and educational content",
  "An online language exchange platform for learners",
  "A toolkit for remote team building activities",
  "A subscription box for eco-friendly household products",
  "An app that connects local farmers with consumers for fresh produce delivery",
  "A virtual reality fitness program that simulates outdoor environments",
  "A website that curates and reviews indie board games",
  "An online marketplace for handmade pet accessories",
  "A budgeting app that gamifies savings goals",
  "A mobile app for collaborative book clubs with reading progress tracking",
  "A digital planner template with customizable layouts",
  "A platform for online cooking classes featuring global cuisines",
  "An augmented reality tool for home interior design and furniture placement",
];

export function getRandomSuggestion(randomNumber: number = Math.random()) {
  return randomSuggestions[Math.floor(randomNumber * randomSuggestions.length)];
}
