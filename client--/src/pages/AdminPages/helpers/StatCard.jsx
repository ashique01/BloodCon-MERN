const StatCard = ({ theme, title, value, icon }) => (
  <div
    className={`
      ${theme === "dark" ? "bg-gray-800" : "bg-white"}
      p-6 rounded-lg shadow-md flex items-center transition-transform transform hover:scale-105
    `}
  >
    <div
      className={`
        flex-shrink-0 p-4 rounded-full 
        ${theme === "dark" ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"}
      `}
    >
      {icon}
    </div>
    <div className="ml-4">
      <p
        className={`
          text-sm font-semibold 
          ${theme === "dark" ? "text-gray-400" : "text-gray-600"}
        `}
      >
        {title}
      </p>
      <p
        className={`
          text-3xl font-bold 
          ${theme === "dark" ? "text-white" : "text-gray-900"}
        `}
      >
        {value}
      </p>
    </div>
  </div>
);

export default StatCard;
