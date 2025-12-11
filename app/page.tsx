'use client';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import {
  Ticket,
  Package,
  Users,
  BarChart3,
  CheckCircle,
  Wrench,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: Ticket,
    title: 'Service Tickets',
    description: 'Track every job from check-in to completion with detailed service records.',
  },
  {
    icon: Package,
    title: 'Inventory Management',
    description: 'Real-time stock tracking with low-stock alerts so you never run out of essential parts.',
  },
  {
    icon: Users,
    title: 'Customer Portal',
    description: 'Empower your customers to book appointments and view service history online.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reporting',
    description:'Understand your business with performance metrics and financial reports.',
  },
];

const benefits = [
  'Reduce paperwork by 80%',
  'Never lose a service record',
  'Improve customer satisfaction',
  'Track inventory automatically',
];

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-steel-50'>
      <Navbar transparent={true} />
      {/* Hero Section */}
      <section className='relative min-h-screen flex items-center bg-linear-to-br from-brand-800
        via-brand-700 to-brand-900 overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute inset-0' style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60'
              xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff
              fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6
              34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32'>
          <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
            {/* Left: Content */}
            <div className='text-center lg:text-left'>
              <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/10 backfrop-blur-sm rounded-full
                text-white/90 text-sm font-medium mb-6'>
                <Wrench className='w-4 h-4' />
                Pro-Level Shop Management
              </div>
              <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6'>
                Run Your Shop<br />
                <span className='text-accent-400'>Smarter</span>, Not Harder
              </h1>
              <p className='text-lg sm:text-xl text-white/80 max-w-xl mx-auto lg:mx-0 mb-8'>
                Autoful handles the front desk work so you can focus on what you do best -- fixing cars.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                <Link href='/register' className='btn-accent btn-lg'>
                  Get Started Free
                  <ArrowRight className='w-5 h-5' />
                </Link>
                <Link
                  href='/login'
                  className='btn btn-lg bg-white/10 text-white hover:bg-white/20 backfrop-blur-sm border border-white/20'
                >
                  Log In
                </Link>
              </div>
            </div>
            {/* Right: Image Gallery */}
            <div className='relative hidden lg:block'>
              <div className='relative w-full h-[500px]'>
                {/* Main Image */}
                <div className='absolute top-0 right-0 w-95 h-70 rounded-2xl overflow-hidden shadow-2xl
                  transform rotate-2 hover:-rotate-2 transition-transform duration-300'>
                  <Image
                    src='/assets/mechanic-shop.png'
                    alt='Mechanic Shop'
                    fill
                    className='object-cover'
                    priority
                  />
                </div>
                {/* Secondary Image */}
                <div className='absolute top-8 left-0 w-60 h-45 rounded-2xl overflow-hidden shadow-xl
                  transform -rotate-3 hover:rotate-3 transition-transform duration-300'>
                  <Image
                    src='/assets/story-reel.png'
                    alt='Service History'
                    fill
                    className='object-cover'
                  />
                </div>
                {/* Accent Image */}
                <div className='absolute bottom-0 right-12 w-70 h-50 rounded-2xl overflow-hidden shadow-xl
                  transform -rotate-1 hover:rotate-7 transition-transform duration-300'>
                  <Image
                    src='/assets/happy-customer.png'
                    alt='Happy Customer'
                    fill
                    className='object-cover'
                  />
                </div>
                {/* Decorative Elements */}
                <div className='absolute -bottom-4 left-20 w-20 h-20 bg-accent-500 rounded-2xl opacity-80' />
                <div className='absolute top-1/2 -left-8 w-16 h-16 bg-brand-400 rounded-full opacity-60' />
              </div>
            </div>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60'>
          <span className='text-sm'>Scroll to explore</span>
          <div className='w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2'>
            <div className='w-1.5 h-3 bg-white/60 rounded-full animate-bounce' />
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className='py-24 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-steel-900 mb-4'>
              Everything You Need to Manage Your Shop
            </h2>
            <p className='text-lg text-steel-600 max-w-2xl mx-auto'>
              From service tickets to inventory tracking, Autoful has the tools to keep your shop running smoothly.
            </p>
          </div>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className='group p-6 bg-steel-50 rounded-2xl hover:bg-brand-600 transition-colors duration-300'
                >
                  <div className='w-14 h-14 bg-brand-100 group-hover:bg-white/20 rounded-xl flex items-center
                    justify-center mb-4 transition-colors'>
                    <Icon className='w-7 h-7 text-brand-600 group-hover:text-white transition-colors' />
                  </div>
                  <h3 className='text-xl font-semibold text-steel-900 group-hover:text-white mb-2 transition-colors'>
                    {feature.title}
                  </h3>
                  <p className='text-steel-600 group-hover:text-white/80 transition-colors'>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* About Section */}
      <section className='py-24 bg-steel-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
            {/* Image */}
            <div className='relative'>
              <div className='relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl'>
                <Image
                  src='/assets/realistic-mechanic.png'
                  alt='Professional Mechanic'
                  fill
                  className='object-cover'
                />
              </div>
              {/* Stats Overlay */}
              <div className='absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 hidden sm:block'>
                <div className='text-3xl font-bold text-brand-600'>80%</div>
                <div className='text-sm text-steel-600'>Less Paperwork</div>
              </div>
            </div>
            {/* Content */}
            <div>
              <h2 className='text-3xl sm:text-4xl font-bold text-steel-900 mb-6'>
                Why Choose Autoful?
              </h2>
              <p className='text-lg text-steel-600 mb-8'>
                Don&apos;t let the paperwork and administrative tasks hold you back from your passion for cars. We know
                how frustrating it is to run a busy shop with outdated tools. Autoful is designed by automotive professionals
                who understand your needs.
              </p>
              <ul className='space-y-4 mb-8'>
                {benefits.map((benefit) => (
                  <li key={benefit} className='flex items-center gap-3'>
                    <div className='w-6 h-6 bg-success-light rounded-full flex items-center justify-center shrink-0'>
                      <CheckCircle className='w-4 h-4 text-success' />
                    </div>
                    <span className='text-steel-700'>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link href='/register' className='btn-primary btn-lg'>
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Team Section */}
      <section className='py-24 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
            {/* Content */}
            <div className='order-2 lg:order-1'>
              <h2 className='text-3xl sm:text-4xl font-bold text-steel-900 mb-6'>
                Built for Mechanics,<br />by Mechanics
              </h2>
              <p className='text-lg text-steel-600 mb-6'>
                Our team combines combines decades of automotive experience with modern software development expertise.
                We&apos;ve been in your shoes - juggling service orders, tracking parts, and keeping everyone happy.
              </p>
              <p className='text-lg text-steel-600 mb-8'>
                That&apos;s why we created Autoful: a tool that actually works the way the mechanics do. No complicated
                setups. No steep learning curves. Just straightforward shop management.
              </p>
              <div className='flex flex-wrap gap-8'>
                <div>
                  <div className='text-3xl font-bold text-brand-600'>500+</div>
                  <div className='text-sm text-steel-600'>Shops Trust Us</div>
                </div>
                <div>
                  <div className='text-3xl font-bold text-brand-600'>50K+</div>
                  <div className='text-sm text-steel-600'>Tickets Processed</div>
                </div>
                <div>
                  <div className='text-3xl font-bold text-brand-600'>4.9*</div>
                  <div className='text-sm text-steel-600'>User Rating</div>
                </div>
              </div>
            </div>
            {/* Image */}
            <div className='order-1 lg:order-2 relative'>
              <div className='relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl'>
                <Image
                  src='/assets/realistic-team.png'
                  alt='Our Team'
                  fill
                  className='object-cover'
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className='py-24 bg-linear-to-br from-brand-700 to-brand-900'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold text-white mb-6'>
            Ready to Streamline Your Work?
          </h2>
          <p className='text-xl text-white/80 mb-8 max-w-2xl mx-auto'>
            Join hundreds of mechanics who have simplified their workflow with Autoful.
            Start your free trial today -- no credit card required.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/register' className='btn-accent btn-lg'>
              Get Started
              <ArrowRight className='w-5 h-5' />
            </Link>
            <Link
              href='/login'
              className='btn btn-lg bg-white/20 text-white hover:bg-white/20 border border-white/20'
            >
              Already Have an Account?
            </Link>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className='bg-steel-900 text-white py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
            {/* Logo */}
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center'>
                <Wrench className='w-5 h-5 text-white' />
              </div>
              <span className='text-xl font-bold'>Autoful</span>
            </div>
            {/* Links */}
            <div className='flex flex-wrap justify-center gap-6 text-sm text-steel-400'>
              <Link href='/login' className='hover:text-white transition-colors'>
                Login
              </Link>
              <Link href='/register' className='hover:text-white transition-colors'>
                Sign Up
              </Link>
              <a
                href='https://github.com/Sys-Redux'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-white transition-colors'
              >
                GitHub
              </a>
            </div>
            {/* Copyright */}
            <p className='text-sm text-steel-500'>
              &copy; {new Date().getFullYear()} Autoful. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}