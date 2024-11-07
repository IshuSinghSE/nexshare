import { subtitle, title } from '@/components/primitives'; // Ensure title is a function that returns a string

export default function PricingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="inline-block max-w-xl text-center justify-center">
                <span className={`${title({ color: 'blue' })}`}>
                    Share Your Files&nbsp;
                </span>
                <br />
                <span className={`${subtitle()} mt-4`}>
                    Upload files to share with others
                </span>
                <br />
            </div>
            {children}
        </section>
    );
}
