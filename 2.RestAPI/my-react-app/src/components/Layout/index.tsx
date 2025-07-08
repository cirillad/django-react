import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { BellIcon } from "@heroicons/react/24/outline";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import {type RootState, useAppSelector} from "../../store";
import { APP_ENV } from "../../env";

type User = { name?: string; username?: string; [key: string]: any };

const navigation = [
    { name: "Dashboard", href: "#", current: true },
    { name: "Team", href: "#", current: false },
    { name: "Projects", href: "#", current: false },
    { name: "Calendar", href: "#", current: false },
    { name: "Reports", href: "#", current: false },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const Layout = () => {
    const user = useAppSelector((state: RootState) => state.auth.user);

    console.log("user", user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());

        navigate("/login");
    };

    const userImageSrc = user?.image
    ? user.image.startsWith("http")
      ? user.image
      : `${APP_ENV.API_BASE_URL}${user.image}`
    : "/images/user/owner.jpg";

    return (
        <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <img
                        className="h-8 w-8"
                        src="https://cdn-icons-png.flaticon.com/512/5450/5450290.png"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                        {user ? (
                            <Menu as="div" className="relative ml-3">
                                <div>
                                    <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm">
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            className="h-8 w-8 rounded-full object-cover"
                                            src={userImageSrc}
                                            alt="User avatar"
                                            style={{ aspectRatio: '1 / 1' }}
                                        />
                                        <span className="ml-2 text-white font-medium">
      {user.username || "User"}
    </span>
                                    </MenuButton>
                                </div>

                                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <MenuItem>
                                        {({ active }) => (
                                            <button
                                                onClick={() => navigate("/profile")}
                                                className={classNames(
                                                    active ? "bg-gray-100" : "",
                                                    "block w-full text-left px-4 py-2 text-sm text-gray-700"
                                                )}
                                            >
                                                Профіль
                                            </button>
                                        )}
                                    </MenuItem>
                                    <MenuItem>
                                        {({ active }) => (
                                            <button
                                                onClick={handleLogout}
                                                className={classNames(
                                                    active ? "bg-gray-100" : "",
                                                    "block w-full text-left px-4 py-2 text-sm text-gray-700"
                                                )}
                                            >
                                                Вийти
                                            </button>
                                        )}
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate("/login")}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm"
                          >
                            Вхід
                          </button>
                          <button
                            onClick={() => navigate("/register")}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                          >
                            Реєстрація
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    <DisclosureButton className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </DisclosureButton>
                  </div>
                </div>
              </div>

              <DisclosurePanel className="md:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                  {navigation.map((item) => (
                    <DisclosureButton
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </DisclosureButton>
                  ))}
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    );
};

export default Layout;