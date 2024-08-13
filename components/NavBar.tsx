import AuthButton from "./AuthButton";

export default async function NavBar() {

  return (<div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
    <AuthButton  />
  </div>)
}