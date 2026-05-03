import Header from "../../assets/component/Header";

export default function AppLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
