import { Link } from '@nextui-org/link';
import { button as buttonStyles } from '@nextui-org/theme';
import { siteConfig } from '@/config/site';
import { title, subtitle } from '@/components/primitives';

export default function Home() {
    return (
        <section className="h-5/6 flex flex-col items-center justify-center gap-8 md:pb-10">
            <div className="inline-block max-w-xl text-center justify-center leading-8">
                <span className={title({ size: 'lg' })}>Upload,&nbsp;</span>
                <span className={title({ size: 'lg', color: 'blue' })}>
                    Save&nbsp;
                </span>
                <span className={title({ size: 'lg' })}>and&nbsp;</span>
                <br />
                <span className={title({ size: 'lg', color: 'blue' })}>
                    Share&nbsp;
                </span>
                <span className={title({ size: 'lg' })}>
                    your files in one place
                </span>
                <div className={subtitle({ class: 'mt-4' })}>
                    Drag and drop your file directly on our cloud and share it
                    with your friends
                </div>
            </div>

            <div className="flex gap-3">
                <Link
                    className={buttonStyles({
                        color: 'primary',
                        radius: 'full',
                        variant: 'shadow',
                        size: 'lg',
                    })}
                    href="/sign-in"
                >
                    Get Started
                </Link>
                <Link
                    className={buttonStyles({
                        variant: 'bordered',
                        radius: 'full',
                        size: 'lg',
                    })}
                    href={siteConfig.links.github}
                >
                    Learn More
                </Link>
            </div>
        </section>
    );
}
