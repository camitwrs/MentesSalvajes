import UserNav from "./UserNav";

const Navbar = () => {
  return (
    <div className="bg-YankeesBlue">
      <div className="flex h-20 items-center">
        <p className="font-bold text-2xl text-white px-6">
          Panel del Educador
        </p>
        <div className="ml-auto items-center px-6">
          <UserNav />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
