const TabBody = ({ children }: { children: any }) => {
  return (
    <ul
      className="flex shadow-md shadow-black rounded-lg mb-0 list-none flex-wrap flex-row bg-transparent bg-opacity-70"
      role="tablist"
    >
      {children}
    </ul>
  );
};

export default TabBody;
