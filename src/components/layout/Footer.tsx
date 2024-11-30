import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo size="lg" showTextOnMobile variant="default" />
            <p className="mt-4 text-muted-foreground">
              Connecting students with mentors for a brighter future in Bangladesh.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Students</h3>
            <ul className="space-y-2">
              <li><Link to="/mentors" className="text-muted-foreground hover:text-primary">Find Mentors</Link></li>
              <li><Link to="/how-it-works" className="text-muted-foreground hover:text-primary">How It Works</Link></li>
              <li><Link to="/success-stories" className="text-muted-foreground hover:text-primary">Success Stories</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Mentors</h3>
            <ul className="space-y-2">
              <li><Link to="/become-mentor" className="text-muted-foreground hover:text-primary">Become a Mentor</Link></li>
              <li><Link to="/mentor-resources" className="text-muted-foreground hover:text-primary">Resources</Link></li>
              <li><Link to="/mentor-guidelines" className="text-muted-foreground hover:text-primary">Guidelines</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Poramorshok. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}