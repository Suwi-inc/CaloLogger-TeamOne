const Logout = () => (
  <button
    onClick={() => {
      localStorage.removeItem("token");
      window.location.reload();
    }}
    className="flex items-center space-x-2"
  >
    <span className="material-symbols-outlined text-gray-600 text-[20px] m-0 p-0 hover:text-black transition duration-200">
      logout
    </span>
  </button>
);

export default Logout;
