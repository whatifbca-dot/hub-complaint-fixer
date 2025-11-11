import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, FileText, Users, Shield, CheckCircle2 } from "lucide-react";
const Index = () => {
  return <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-6">
            <Building2 className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">Brototype 
Complaint Portal<span className="block text-primary mt-2">Complaint Portal</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A transparent and efficient system for students to submit complaints and for administrators to manage them effectively.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link to="/resolved-complaints">View Resolved Issues</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Why Use Our Portal?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Easy Submission</h3>
              <p className="text-sm text-muted-foreground">
                Submit complaints with detailed forms and file attachments
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Student Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Track your complaints and receive updates in real-time
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Admin Management</h3>
              <p className="text-sm text-muted-foreground">
                Efficient tools for administrators to manage and resolve issues
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Transparency</h3>
              <p className="text-sm text-muted-foreground">
                Public access to all resolved complaints for accountability
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Complaint Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {["Technical", "Cleanliness", "Power/Network", "Infrastructure", "Staff-related"].map(category => <Card key={category} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <p className="font-medium text-foreground">{category}</p>
              </CardContent>
            </Card>)}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-6 text-primary-foreground/90">
              Join our platform and help make the Software Hub a better place
            </p>
            <Button size="lg" variant="secondary" asChild className="text-lg px-8">
              <Link to="/auth">Sign Up Now</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Software Hub Complaint Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>;
};
export default Index;