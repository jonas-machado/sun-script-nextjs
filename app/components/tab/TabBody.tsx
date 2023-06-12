const TabBody = ({ children }: { children: any }) => {
  return (
    <ul
      className="flex rounded-lg mb-0 list-none flex-wrap flex-row bg-gray-900"
      role="tablist"
    >
      {children}
    </ul>
  );
};

export default TabBody;