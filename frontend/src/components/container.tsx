type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const Container = ({ children }: Props) => {
  return <div className="w-[80%] m-auto px-0 md:px-3">{children}</div>;
};

export default Container;
