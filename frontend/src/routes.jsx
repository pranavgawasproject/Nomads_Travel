import { createBrowserRouter } from "react-router-dom";

import NomadAiLayout from "./pages/NomadAiLayout";
import PersistLogin from "./layout/PersistsLogin";

import AiHome from "./pages/AiHome";
import AiSearch from "./pages/AiSearch";
import AiSearchResults from "./pages/AiSearchResults";
import AiGlobalListings from "./pages/AiGlobalListings";
import AiListings from "./pages/AiListings";
import AiListingsListView from "./pages/AiListingsListView";
import AiProduct from "./pages/AiProduct";
import AiImageGallery from "./pages/AiImageGallery";
import AiWorldRankings from "./pages/AiWorldRankingsSearchResults";
import AiSavingsSearch from "./pages/AiSavingsSearch";
import AiSavingsSearchResults from "./pages/AiSavingsSearchResults";
// CAREER PAGES DISABLED
// import AiCareerSearch from "./pages/AiCareerSearch";
// import AiCareerSearchResults from "./pages/AiCareerSearchResults";
import AiCompatibleSearch from "./pages/AiCompatibleSearch";
import AiCompatibleSearchResults from "./pages/AiCompatibleSearchResults";
import AiHomeLoggedIn from "./pages/AiHomeLoggedIn";
import AiLogin from "./pages/AiLogin";
import AiSignup from "./pages/AiSignup";
import AiProfile from "./pages/AiProfile";
import AiVisaSupport from "./pages/AiVisaSupport";
import AiVisaSupportThankYou from "./pages/AiVisaSupportThankYou";
import AiOverallActivationSupport from "./pages/AiOverallActivationSupport";
import AiNewCompanySetup from "./pages/AiNewCompanySetup";
import AiConsultation from "./pages/AiConsultation";
import AiWorkation from "./pages/AiWorkation";
import AiManualSearch from "./pages/AiManualSearch";
import AiBecomeContributor from "./pages/AiBecomeContributor";
import AiBlogsFetch from "./components/AiBlogsFetch";
import AiNewsFetch from "./components/AiNewsFetch";
import AiBlogDetails from "./pages/AiBlogDetails";
import AiForgotPassword from "./pages/AiForgotPassword";
import AiResetPassword from "./pages/AiResetPassword";
import AiAbout from "./pages/AiAbout";
import AiPrivacy from "./pages/AiPrivacy";
import AiContact from "./pages/AiContact";
// import AiCareer from "./pages/AiCareer";
import AiFAQ from "./pages/AiFAQ";
import AiTermsAndConditions from "./pages/AiTermsAndConditions";
import AiContentAndCopyright from "./pages/AiContentAndCopyright";
import AiContentUseRemoval from "./pages/AiContentUseRemoval";
// import AiJobDetail from "./pages/AiJobDetail";
import AiDestinationDetail from "./pages/AiDestinationDetail";
import AiTripTracker from "./pages/AiTripTracker";
import AiCompare from "./pages/AiCompare";
import AiCostOfLiving from "./pages/AiCostOfLiving";
import AiVisaTracker from "./pages/AiVisaTracker";
import AiNearbyNomads from "./pages/AiNearbyNomads";
import AiForum from "./pages/AiForum";

const routerConfig = [
  {
    element: <PersistLogin />,
    children: [
      {
        element: <NomadAiLayout />,
        path: "/",
        children: [
          { index: true, element: <AiHome /> },
          { path: "home", element: <AiHome /> },
          { path: "ai-login/:redirectGoal?", element: <AiLogin /> },
          { path: "ai-signup", element: <AiSignup /> },
          { path: "ai-forgot-password", element: <AiForgotPassword /> },
          { path: "ai-reset-password/:token", element: <AiResetPassword /> },
          { path: "home-logged-in", element: <AiHomeLoggedIn /> },
          { path: "search", element: <AiSearch /> },
          { path: "world-rankings", element: <AiWorldRankings /> },
          { path: "savings", element: <AiSavingsSearch /> },
          { path: "savings/results", element: <AiSavingsSearchResults /> },
          // { path: "career-search", element: <AiCareerSearch /> },
          { path: "compatible", element: <AiCompatibleSearch /> },
          {
            path: "compatible/results",
            element: <AiCompatibleSearchResults />,
          },
          // {
          //   path: "career-search/results",
          //   element: <AiCareerSearch />,
          // },
          {
            path: "search/results/:loc?/:attr?",
            element: <AiSearchResults />,
          },
          {
            path: "search/:goal/results/:loc?/:attr?",
            element: <AiSearchResults />,
          },
          {
            path: "manual-search/:continent?/:country?",
            element: <AiManualSearch />,
          },
          { path: "ai-verticals", element: <AiGlobalListings /> },
          { path: "ai-blogs", element: <AiBlogsFetch /> },
          { path: "ai-blogs/ai-blog-details", element: <AiBlogDetails /> },
          { path: "ai-news", element: <AiNewsFetch /> },
          { path: "ai-news/ai-news-details", element: <AiBlogDetails /> },
          {
            path: "ai-events/:eventId",
            element: <AiDestinationDetail type="event" />,
          },
          {
            path: "ai-venues/:venueId",
            element: <AiDestinationDetail type="venue" />,
          },
          { path: "ai-listings", element: <AiListings /> },
          { path: "ai-listings-list", element: <AiListingsListView /> },
          { path: "ai-listings/:company", element: <AiProduct /> },
          {
            path: "ai-listings/:company/images",
            element: <AiImageGallery />,
          },
          { path: "visa-support", element: <AiVisaSupport /> },
          {
            path: "visa-support/thank-you",
            element: <AiVisaSupportThankYou />,
          },
          {
            path: "overall-activation-support",
            element: <AiOverallActivationSupport />,
          },
          {
            path: "new-company-setup",
            element: <AiNewCompanySetup />,
          },
          { path: "consultation", element: <AiConsultation /> },
          { path: "workation", element: <AiWorkation /> },
          { path: "ai-profile", element: <AiProfile /> },
          {
            path: "become-a-contributor",
            element: <AiBecomeContributor />,
          },
          { path: "ai-about", element: <AiAbout /> },
          { path: "ai-privacy", element: <AiPrivacy /> },
          { path: "ai-contact", element: <AiContact /> },
          // { path: "ai-career", element: <AiCareer /> },
          // { path: "ai-career/job/:title", element: <AiJobDetail /> },
          { path: "ai-faq", element: <AiFAQ /> },
          {
            path: "ai-terms-and-conditions",
            element: <AiTermsAndConditions />,
          },
          {
            path: "ai-content-and-copyright",
            element: <AiContentAndCopyright />,
          },
          {
            path: "ai-content-use-removal",
            element: <AiContentUseRemoval />,
          },
          { path: "trip-tracker", element: <AiTripTracker /> },
          { path: "compare", element: <AiCompare /> },
          { path: "cost-of-living", element: <AiCostOfLiving /> },
          { path: "visa-tracker", element: <AiVisaTracker /> },
          { path: "nearby", element: <AiNearbyNomads /> },
          { path: "forum", element: <AiForum /> },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routerConfig);

export default router;
