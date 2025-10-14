import { Clock, Users, Award, Heart } from "lucide-react";

const milestones = [
  {
    year: "1900",
    title: "The Beginning",
    description:
      "Kotaiah started his sweet shop with a simple dream - to bring authentic Indian sweets to every household.",
    icon: Heart,
  },
  {
    year: "1920",
    title: "Expansion",
    description:
      "Opened our second location and introduced new varieties, becoming a household name in Hyderabad.",
    icon: Users,
  },
  {
    year: "1950",
    title: "Recognition",
    description:
      'Received the prestigious "Best Traditional Sweets" award from the State Government.',
    icon: Award,
  },
  {
    year: "2024",
    title: "Digital Era",
    description:
      "Launched our online platform to serve customers across India while maintaining our traditional values.",
    icon: Clock,
  },
];

export function OurStorySection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-4">
            Our Story
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            For over 124 years, Kotaiah's Sweets & Foods has been crafting
            authentic Indian sweets using traditional recipes passed down
            through generations. Our commitment to quality and authenticity has
            made us a beloved institution in Hyderabad and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {milestones.map((milestone, index) => (
            <div key={milestone.year} className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <milestone.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-heading font-bold text-primary-500 mb-2">
                  {milestone.year}
                </div>
                {index < milestones.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 transform translate-x-4"></div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                {milestone.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {milestone.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-white text-center" style={{backgroundColor: '#7B1E2D', color: 'white'}}>
          <h3 className="text-2xl font-heading font-bold mb-4 text-white" style={{color: 'white'}}>
            Our Promise to You
          </h3>
          <p className="text-lg text-white max-w-3xl mx-auto font-medium" style={{color: 'white', fontSize: '18px', fontWeight: '500'}}>
            We promise to continue delivering the same authentic taste and
            quality that has made us a trusted name for over 124 years. Every
            sweet we make is crafted with love, using traditional methods and
            the finest ingredients.
          </p>
        </div>
      </div>
    </section>
  );
}
