import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, MessageSquare, User, Settings, LogOut, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import LiveSupport from './LiveSupport';
import Logo from './Logo';
import { useTranslation } from '@/hooks/useTranslation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLiveSupportOpen, setIsLiveSupportOpen] = useState(false);
  const { t } = useTranslation();

  const menuItems = [
    { title: t('nav.findMentors'), href: '/mentors' },
    !user?.role && { title: t('nav.becomeMentor'), href: '/become-mentor' },
  ].filter(Boolean);

  const userMenuItems = [
    { title: t('nav.dashboard'), href: '/dashboard', icon: User },
    { title: t('nav.messages'), href: '/messages', icon: MessageSquare },
    { title: t('nav.settings'), href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Logo size="sm" />

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <nav className="flex items-center gap-6">
                {menuItems.map((item) => item && (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-4">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiveSupportOpen(true)}
                className="relative"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
              <ThemeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    {userMenuItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link to={item.href} className="cursor-pointer">
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('nav.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">{t('nav.login')}</Button>
                  </Link>
                  <Link to="/register">
                    <Button>{t('nav.getStarted')}</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="mb-8">
                    <Logo size="lg" showTextOnMobile />
                  </div>
                  <nav className="flex flex-col gap-4">
                    {menuItems.map((item) => item && (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="block px-2 py-1 text-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.title}
                      </Link>
                    ))}
                    {user ? (
                      <>
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            className="flex items-center gap-2 px-2 py-1 text-lg"
                            onClick={() => setIsOpen(false)}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                          </Link>
                        ))}
                        <button
                          onClick={() => {
                            logout();
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-2 px-2 py-1 text-lg text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          {t('nav.logout')}
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full">{t('nav.login')}</Button>
                        </Link>
                        <Link to="/register" onClick={() => setIsOpen(false)}>
                          <Button className="w-full">{t('nav.getStarted')}</Button>
                        </Link>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => {
                          setIsLiveSupportOpen(true);
                          setIsOpen(false);
                        }}
                      >
                        <HelpCircle className="h-4 w-4" />
                        {t('nav.getHelp')}
                      </Button>
                      <ThemeToggle />
                      <LanguageSwitcher />
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <LiveSupport
        isOpen={isLiveSupportOpen}
        onClose={() => setIsLiveSupportOpen(false)}
      />
    </>
  );
}