interface input {
  label: string;
  placeholder?: string;
  id?: string;
  name?: string;
  onChange?: any;
  value?: any;
}
const Input = ({ label, placeholder, id, name, onChange, value }: input) => {
  return (
    <div className="mt-1 flex rounded-md shadow-sm">
      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-900 bg-opacity-70 bg-gray-700 px-3 text-sm text-gray-200">
        {label}
      </span>
      <input
        value={value}
        onChange={onChange}
        type="text"
        name={name}
        id={id}
        className="block caret-gray-200 outline-none w-full h-10 flex-1 rounded-none rounded-r-md bg-gray-900 bg-opacity-70 pl-3 text-gray-200 border-gray-900 sm:text-sm autofill:shadow-[inset_0_0_0px_1000px_rgb(17,24,39,0.7)] border-b-[1px] border-t-[1px]"
        placeholder={placeholder}
        spellCheck="false"
      />
    </div>
  );
};

export default Input;
