import React from "react";
import { Link } from "react-router-dom";
import { Brain, BookOpen, Clock, Calendar, Target, TrendingUp, Award, ArrowRight } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-20 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-6">
                Sblocca il tuo potenziale di studio con <span className="text-accent-400">EduBoost</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
                EduBoost è la tua piattaforma di studio intelligente che combina intelligenza artificiale e tecniche di studio comprovate per aiutarti
                a massimizzare il tuo potenziale.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard" className="btn bg-white text-primary-700 hover:bg-gray-100">
                  Cominciamo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a href="#features" className="btn bg-transparent text-white border border-white/30 hover:bg-white/10">
                  Scopri di più
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
            <div className="hidden md:block animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <img
                src="https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg"
                alt="Student studying"
                className="rounded-lg shadow-xl object-cover h-96 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Funzionalità Progettate Per Il Successo Degli Studenti</h2>
            <p className="text-lg text-gray-600">
              EduBoost combina intelligenza artificiale e tecniche di studio comprovate per aiutarti a massimizzare il tuo potenziale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calendar className="h-10 w-10 text-primary-600" />}
              title="Smart Study Routines"
              description="Create personalized study schedules based on your goals, subjects, and optimal study times."
              delay={0.1}
            />
            <FeatureCard
              icon={<Brain className="h-10 w-10 text-primary-600" />}
              title="Mental Maps"
              description="Build interactive mind maps to visualize connections between concepts and enhance retention."
              delay={0.2}
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-primary-600" />}
              title="Adaptive Quizzes"
              description="Test your knowledge with AI-generated questions that focus on your weak areas."
              delay={0.3}
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-primary-600" />}
              title="Focus Mode"
              description="Block distractions and stay motivated with timed study sessions and incentives."
              delay={0.4}
            />
            <FeatureCard
              icon={<TrendingUp className="h-10 w-10 text-primary-600" />}
              title="Progress Analytics"
              description="Track your study habits, quiz performance, and knowledge growth over time."
              delay={0.5}
            />
            <FeatureCard
              icon={<Target className="h-10 w-10 text-primary-600" />}
              title="Study Tips & Techniques"
              description="Get personalized recommendations for study methods based on your learning style."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cosa dicono i nostri User</h2>
            <p className="text-lg text-gray-600">Unisciti a migliaia di studenti che hanno trasformato le loro abitudini di studio con EduBoost</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="EduBoost mi ha aiutato a organizzare le mie sessioni di studio in modo così efficiente. Non posso credere quanto tempo ho risparmiato!"
              name="Sofia Martinez"
              role="University Student"
              image="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
              delay={0.1}
            />
            <TestimonialCard
              quote="Le mappe mentali sono state un cambiamento radicale per me. Posso visualizzare le informazioni in modo così chiaro ora."
              name="James Wilson"
              role="High School Student"
              image="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
              delay={0.2}
            />
            <TestimonialCard
              quote="Le domande adattive mi hanno aiutato a concentrarmi sulle aree in cui avevo bisogno di migliorare. È come avere un tutor personale!"
              name="Aisha Johnson"
              role="Professional"
              image="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-secondary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto a cambiare le tue abitudini di studio?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Unisciti a migliaia di studenti che studiano in modo più intelligente,non più faticoso,con EduBoost.
          </p>
          <Link to="/dashboard" className="btn bg-white text-secondary-700 hover:bg-gray-100 px-8 py-3 text-lg">
            Inizia gratuitamente
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-4 text-white/80 text-sm">Non è richiesta alcuna carta di credito.Inizia oggi stesso con il nostro piano gratuito.</p>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <div className="card p-6 border transition-all duration-300 hover:border-primary-300 animate-slide-up" style={{ animationDelay: `${delay}s` }}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  image: string;
  delay: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role, image, delay }) => {
  return (
    <div className="card p-6 animate-slide-up" style={{ animationDelay: `${delay}s` }}>
      <div className="flex mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Award key={star} className="h-5 w-5 text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-700 mb-6">"{quote}"</p>
      <div className="flex items-center">
        <img src={image} alt={name} className="h-12 w-12 rounded-full object-cover mr-4" />
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
