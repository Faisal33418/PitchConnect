import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Jane Doe",
    role: "Angel Investor",
    quote: "The quality of deals here is unmatched in the industry.",
    avatar: "JD",
  },
  {
    id: 2,
    name: "Alex Smith",
    role: "Founder, GreenTech",
    quote: "This platform connected me with exactly the right investors.",
    avatar: "AS",
  },
  {
    id: 3,
    name: "Maria Garcia",
    role: "VC Partner",
    quote: "Our best performing investments came from this community.",
    avatar: "MG",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Tech Entrepreneur",
    quote: "Raised our Series A faster than we ever imagined possible.",
    avatar: "DK",
  },
];

export const Testimonials = () => {
  return (
    <div className="py-16 px-4 bg-gradient-to-br from-[#edf2f7] to-[#d8e3f0]">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        What Our Community Says
      </h2>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={"auto"}
        navigation={true}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 150,
          modifier: 1.5,
          slideShadows: false,
        }}
        modules={[EffectCoverflow, Navigation]}
        className="max-w-4xl mx-auto"
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide
            key={testimonial.id}
            className="bg-white rounded-xl shadow-xl p-6 w-[280px] md:w-[300px] flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#0F5233] flex items-center justify-center text-white text-xl font-bold mb-4">
              {testimonial.avatar}
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-800">
              {testimonial.name}
            </h3>
            <p className="text-sm text-gray-500 text-center mb-3">
              {testimonial.role}
            </p>
            <p className="text-gray-700 italic text-center text-sm mb-4">
              “{testimonial.quote}”
            </p>
            <div className="flex justify-center mt-auto">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
