import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Hyderabad",
    rating: 5,
    text: "The Gulab Jamun from Kotaiah's is absolutely divine! It reminds me of my grandmother's recipe. The quality and taste are unmatched.",
    avatarColor: "bg-pink-500",
  },
  {
    name: "Rajesh Kumar",
    location: "Bangalore",
    rating: 5,
    text: "I've been ordering from Kotaiah's for years. Their Kaju Katli is the best I've ever had. Fresh, authentic, and delivered right to my doorstep.",
    avatarColor: "bg-blue-500",
  },
  {
    name: "Anita Reddy",
    location: "Chennai",
    rating: 5,
    text: "The Diwali gift box was perfect! Every sweet was fresh and delicious. My family loved it. Will definitely order again.",
    avatarColor: "bg-green-500",
  },
  {
    name: "Vikram Singh",
    location: "Mumbai",
    rating: 5,
    text: "Outstanding quality and service! The Samosas are crispy and the filling is perfectly spiced. Highly recommended!",
    avatarColor: "bg-purple-500",
  },
  {
    name: "Sunita Patel",
    location: "Delhi",
    rating: 5,
    text: "Kotaiah's has become our go-to for all special occasions. The traditional recipes and authentic taste keep us coming back.",
    avatarColor: "bg-orange-500",
  },
  {
    name: "Arjun Mehta",
    location: "Pune",
    rating: 5,
    text: "The packaging is excellent and the sweets arrive fresh every time. The customer service is also very responsive and helpful.",
    avatarColor: "bg-teal-500",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our valued customers
            have to say about their experience with Kotaiah's Sweets & Foods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card p-6 relative">
              <div className="absolute top-4 right-4 text-primary-500 opacity-20">
                <Quote className="h-8 w-8" />
              </div>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>

              <p className="text-text-secondary mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center">
                <div className={`w-12 h-12 ${testimonial.avatarColor} rounded-full flex items-center justify-center text-white font-semibold mr-4 shadow-md`}>
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-semibold text-text-primary">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-8 text-sm text-text-secondary">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span>4.9/5 Average Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>10,000+</span>
              <span>Happy Customers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>124+</span>
              <span>Years of Trust</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
