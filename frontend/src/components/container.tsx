type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const Container = ({ children }: Props) => {
  return <div className="w-[80%] m-auto">{children}</div>;
};

export default Container;
