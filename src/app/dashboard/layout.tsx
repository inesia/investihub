export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html, body {
              overflow: hidden !important;
              height: 100% !important;
              width: 100% !important;
              position: fixed;
            }
          `,
        }}
      />
      {children}
    </>
  );
}
