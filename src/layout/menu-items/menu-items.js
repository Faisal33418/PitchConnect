import LightbulbCircleIcon from "@mui/icons-material/LightbulbCircle";
import SocialDistanceIcon from "@mui/icons-material/SocialDistance";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";

const navItems = [
  {
    title: "overview",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.3em"
        height="1.3em"
        viewBox="0 0 24 24"
      >
        <path
          fill="#808080"
          d="m19.675 20.375l.7-.7L18.5 17.8V15h-1v3.2zM18 23q-2.075 0-3.537-1.463T13 18t1.463-3.537T18 13t3.538 1.463T23 18t-1.463 3.538T18 23M7 9h10V7H7zm4.675 12H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v6.7q-.725-.35-1.463-.525T18 11q-.275 0-.513.012t-.487.063V11H7v2h6.125q-.45.425-.812.925T11.675 15H7v2h4.075q-.05.25-.062.488T11 18q0 .825.15 1.538T11.675 21"
        />
      </svg>
    ),
  },
  {
    title: "Help",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.3em"
        height="1.3em"
        viewBox="0 0 24 24"
      >
        <path
          fill="#808080"
          d="M11.95 18q.525 0 .888-.363t.362-.887t-.362-.888t-.888-.362t-.887.363t-.363.887t.363.888t.887.362m-.9-3.85h1.85q0-.825.188-1.3t1.062-1.3q.65-.65 1.025-1.238T15.55 8.9q0-1.4-1.025-2.15T12.1 6q-1.425 0-2.312.75T8.55 8.55l1.65.65q.125-.45.563-.975T12.1 7.7q.8 0 1.2.438t.4.962q0 .5-.3.938t-.75.812q-1.1.975-1.35 1.475t-.25 1.825M12 22q-2.075 0-3.9-.787t-3.175-2.138T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
        />
      </svg>
    ),
  },
];

const MenuItems = [
  {
    title: "All Pitches",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.3em"
        height="1.3em"
        viewBox="0 0 16 16"
      >
        <path
          fill="#808080"
          fill-rule="evenodd"
          d="M14 4H2V3h12zM9.456 6.005a2.451 2.451 0 1 0 0 4.902a2.451 2.451 0 0 0 0-4.902m-3.451 2.45a3.451 3.451 0 1 1 6.219 2.062l1.717 1.716l-.708.707l-1.716-1.716a3.451 3.451 0 0 1-5.512-2.768M5 8.5H2v-1h3zM6 13H2v-1h4z"
          clip-rule="evenodd"
        />
      </svg>
    ),
    link: "/find-entrepreneurs",
  },
  {
    title: "Idea Pitches",
    icon: (
      <TipsAndUpdatesIcon
        fontSize="small"
        color="action"
        className="sidebar-icons"
      />
    ),
    link: "/entrepreneur-business",
  },
  {
    title: "Featured Ideas",
    icon: (
      <LightbulbCircleIcon
        fontSize="small"
        color="action"
        className="sidebar-icons"
      />
    ),
    link: "/featured-ideas",
  },
  {
    title: "Social Properity",
    icon: (
      <SocialDistanceIcon
        fontSize="small"
        color="action"
        className="sidebar-icons"
      />
    ),
    link: "/#social",
  },
  {
    title: "Interprated Communication",
    icon: (
      <ConnectWithoutContactIcon
        fontSize="small"
        color="action"
        className="sidebar-icons"
      />
    ),
    link: "/chat/admin",
  },
];
const AdminItems = [
  {
    title: "Investors",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.3em"
        height="1.3em"
        viewBox="0 0 48 48"
      >
        <path
          fill="none"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5.504 41.251H42.5V28.153M7.434 37.688L22.424 22.7l5.108 5.108L42.5 12.84v11.056M31.359 12.839H42.5"
        />
        <rect
          width="13.13"
          height="11.358"
          x="5.5"
          y="12.402"
          fill="none"
          stroke="#808080"
          stroke-linecap="round"
          stroke-linejoin="round"
          rx="2.181"
        />
        <path
          fill="none"
          stroke="#808080"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.562 16.188h10.067M5.5 19.974h10.067"
        />
        <circle
          cx="12.056"
          cy="8.589"
          r="1.84"
          fill="none"
          stroke="#808080"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    link: "/investor",
  },
  {
    title: "Entrepreneurs",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.3em"
        height="1.3em"
        viewBox="0 0 20 20"
      >
        <path
          fill="gray"
          d="M17 16.9v-2.5c0-.7-.1-1.4-.5-2.1s-.9-1.3-1.6-1.7c-.7-.5-2.2-.6-2.9-.6l-1.6 1.7l.6 1.3v3l-1 1.1L9 16v-3l.7-1.3L8 10c-.8 0-2.3.1-3 .6c-.7.4-1.1 1-1.5 1.7S3 13.6 3 14.4v2.5S5.6 18 10 18s7-1.1 7-1.1M10 2.1c-1.9 0-3 1.8-2.7 3.8S8.6 9.3 10 9.3s2.4-1.4 2.7-3.4c.3-2.1-.8-3.8-2.7-3.8"
        />
      </svg>
    ),
    link: "/entrepreneur",
  },
];

export { navItems, MenuItems, AdminItems };
