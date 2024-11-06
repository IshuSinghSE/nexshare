import { Link } from '@nextui-org/link';
import { button as buttonStyles } from '@nextui-org/theme';
import { siteConfig } from '@/config/site';
import { title, subtitle } from '@/components/primitives';

export default function Home() {
    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="inline-block max-w-xl text-center justify-center">
                <span className={title()}>Make&nbsp;</span>
                <span className={title({ color: 'violet' })}>
                    beautiful&nbsp;
                </span>
                <br />
                <span className={title()}>
                    websites regardless of your design experience.
                </span>
                <div className={subtitle({ class: 'mt-4' })}>
                    Beautiful, fast and modern React UI library.
                </div>
            </div>

            <div className="flex gap-3">
                <Link
                    isExternal
                    className={buttonStyles({
                        color: 'primary',
                        radius: 'full',
                        variant: 'shadow',
                    })}
                    href={siteConfig.links.docs}
                >
                    Get Started
                </Link>
                <Link
                    isExternal
                    className={buttonStyles({
                        variant: 'bordered',
                        radius: 'full',
                    })}
                    href={siteConfig.links.github}
                >
                    Learn More
                </Link>
            </div>
        </section>
    );
}