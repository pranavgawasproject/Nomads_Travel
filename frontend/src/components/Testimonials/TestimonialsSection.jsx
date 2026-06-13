import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    initials: "DD",
    name: "Dariha",
    rating: 5,
    review:
      "The market has a huge gap on a one-stop shop with personalized service. The team delivered an end-to-end service.",
  },
  {
    initials: "MS",
    name: "Maxime S.",
    rating: 5,
    review:
      "Purchasing a property in Dubai can be challenging. We worked with Levent Tensel, senior mortgage consultant at Bridg, for...",
  },
  {
    initials: "KK",
    name: "Karan",
    rating: 5,
    review:
      "They got the best rates from the banks with the competitive rates from rest of the market.",
  },
  {
    initials: "AA",
    name: "Alexandar",
    rating: 5,
    review:
      "Bridg guided us through all the process with a lot of patience and professionalism.",
  },
];

export default function TestimonialsSection() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {testimonials.map((testimonial, index) => (
        <TestimonialCard key={index} {...testimonial} />
      ))}
    </div>
  );
}
