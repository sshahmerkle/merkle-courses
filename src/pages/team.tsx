import Layout from '@/components/Layout';
import siteConfig from '@/config/site';

export default function TeamPage() {
  const { team } = siteConfig;

  return (
    <Layout title={`Team | ${siteConfig.name}`} description={`Meet the team behind ${siteConfig.name}`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{team.heading}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-base">{team.subheading}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.members.map((member, i) => (
            <div key={member.email} className="bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-brand-cyan/40 dark:hover:border-blue-500/40 transition-all animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl ${member.color} flex items-center justify-center text-white font-black text-sm flex-shrink-0`}>
                  {member.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{member.name}</p>
                  <p className="text-xs text-brand-muted dark:text-gray-500">{member.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">{member.bio}</p>
              <a
                href={`mailto:${member.email}`}
                className="inline-flex items-center gap-2 text-sm text-brand-cyan dark:text-blue-400 hover:text-brand-cyan-light font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {member.email}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-gray-50 dark:bg-dm-raised border border-brand-gray-light dark:border-dm-border rounded-2xl max-w-2xl">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Not sure who to contact?</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Send a general enquiry to{' '}
            <a href={`mailto:${team.fallbackEmail}`} className="text-brand-cyan dark:text-blue-400 hover:underline font-medium">
              {team.fallbackEmail}
            </a>{' '}
            and we&apos;ll direct your message to the right person.
          </p>
        </div>
      </div>
    </Layout>
  );
}
