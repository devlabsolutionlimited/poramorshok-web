import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

export default function Footer() {
  const { language } = useLanguage();
  const t = language === 'bn' ? translations.bn.footer : null;

  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo size="lg" showTextOnMobile variant="default" />
            <p className="mt-4 text-muted-foreground">
              {language === 'bn' 
                ? 'বাংলাদেশে উজ্জ্বল ভবিষ্যতের জন্য শিক্ষার্থীদের মেন্টরদের সাথে সংযোগ করা।'
                : 'Connecting students with mentors for a brighter future in Bangladesh.'}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">
              {t ? t.forStudents.title : 'For Students'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/mentors" className="text-muted-foreground hover:text-primary">
                  {t ? t.forStudents.findMentors : 'Find Mentors'}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-primary">
                  {t ? t.forStudents.howItWorks : 'How It Works'}
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-muted-foreground hover:text-primary">
                  {t ? t.forStudents.successStories : 'Success Stories'}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">
              {t ? t.forMentors.title : 'For Mentors'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/become-mentor" className="text-muted-foreground hover:text-primary">
                  {t ? t.forMentors.becomeMentor : 'Become a Mentor'}
                </Link>
              </li>
              <li>
                <Link to="/mentor-resources" className="text-muted-foreground hover:text-primary">
                  {t ? t.forMentors.resources : 'Resources'}
                </Link>
              </li>
              <li>
                <Link to="/mentor-guidelines" className="text-muted-foreground hover:text-primary">
                  {t ? t.forMentors.guidelines : 'Guidelines'}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">
              {t ? t.company.title : 'Company'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary">
                  {t ? t.company.about : 'About Us'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary">
                  {t ? t.company.contact : 'Contact'}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary">
                  {t ? t.company.privacy : 'Privacy Policy'}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Poramorshok. {t ? t.copyright : 'All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
}