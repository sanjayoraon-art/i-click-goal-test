
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-grid-slate-100/[0.05] dark:bg-grid-slate-900/[0.2]">
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border">
              <CardHeader>
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary text-center">
                  Privacy Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                
                <h2 className="text-xl font-semibold text-foreground pt-4">Introduction</h2>
                <p>
                  Our Click Speed Test website ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose information about you when you use our website.
                </p>

                <h2 className="text-xl font-semibold text-foreground pt-4">Information We Collect</h2>
                <p>
                  We do not collect any personal information from you. Your click speed test results are processed in your browser and are not stored on our servers. We may use anonymous usage data through analytics services to understand how our website is used and to improve it.
                </p>

                <h2 className="text-xl font-semibold text-foreground pt-4">Advertising</h2>
                <p>
                  This website may display ads from Google AdSense. Google may use cookies to serve ads based on a user's prior visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ads Settings</a>.
                </p>

                <h2 className="text-xl font-semibold text-foreground pt-4">Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                </p>

                <h2 className="text-xl font-semibold text-foreground pt-4">Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, you can contact us. (We will provide a contact method soon).
                </p>
              </CardContent>
            </Card>
            <div className="text-center mt-8">
              <Link href="/">
                <Button>
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
      <footer className="w-full bg-card/80 backdrop-blur-sm p-4 text-center text-muted-foreground">
          <div className="container mx-auto flex justify-center items-center space-x-4">
              <span>&copy; {new Date().getFullYear()} Click Speed Test. All rights reserved.</span>
              <Link href="/about" className="hover:text-primary">About Us</Link>
              <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="hover:text-primary">Terms & Conditions</Link>
          </div>
      </footer>
    </>
  );
}
