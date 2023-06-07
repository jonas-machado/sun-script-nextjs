const TabBody = ({ children }: { children: any }) => {
  return (
    <ul
      className="flex mb-0 list-none flex-wrap border-2 border-black flex-row bg-gray-900"
      role="tablist"
    >
      {children}
    </ul>
  );
};

export default TabBody;
