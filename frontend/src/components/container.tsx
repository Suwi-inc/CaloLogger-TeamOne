type Props = {
  children: string | JSX.Element | JSX.Element[];
};

/**
 * A container component that wraps its children with a div element.
 *
 * @param {Props} props - The component props.
 * @param {React.ReactNode} props.children - The children elements to be wrapped.
 * @returns {JSX.Element} The container component.
 */
const Container = ({ children }: Props) => {
  return <div className="w-[60%] m-auto px-0 md:px-3">{children}</div>;
};

export default Container;
