import Head from "next/head";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Política de Privacidad - Equi·Parents</title>
        <meta
          name="description"
          content="Conoce cómo Equi·Parents protege tu privacidad y administra tus datos personales."
        />
      </Head>
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6">Política de Privacidad</h1>
        <p className="mb-4">
          En Equi·Parents, nos comprometemos a proteger la información personal
          de nuestros usuarios. Esta política de privacidad describe cómo
          recopilamos, usamos, almacenamos y protegemos tu información, así como
          tus derechos en relación con tus datos.
        </p>
        <h2 className="text-2xl font-semibold mb-3">
          Información que Recopilamos
        </h2>
        <p className="mb-4">
          Recopilamos información que proporcionas al crear una cuenta o al
          utilizar nuestros servicios, incluyendo nombre, correo electrónico,
          datos de contacto, y datos relacionados con la administración de la
          corresponsabilidad parental. También podemos recopilar datos de uso y
          navegación para mejorar la experiencia del usuario.
        </p>
        <h2 className="text-2xl font-semibold mb-3">Uso de la Información</h2>
        <p className="mb-4">
          Utilizamos tu información para administrar y mejorar los servicios de
          Equi·Parents, para comunicarnos contigo, y para generar métricas que
          nos permitan optimizar la distribución equitativa de las tareas y el
          bienestar familiar. Además, usamos técnicas de encriptación y
          controles de acceso para proteger tus datos.
        </p>
        <h2 className="text-2xl font-semibold mb-3">
          Compartir y Proteger la Información
        </h2>
        <p className="mb-4">
          No compartimos tu información con terceros sin tu consentimiento,
          salvo cuando sea requerido por la ley o para proteger nuestros
          derechos. Implementamos medidas de seguridad físicas, administrativas
          y técnicas para evitar el acceso no autorizado, la alteración o la
          divulgación de tus datos.
        </p>
        <h2 className="text-2xl font-semibold mb-3">Tus Derechos</h2>
        <p className="mb-4">
          Tienes derecho a acceder, rectificar y, en su caso, eliminar tus datos
          personales. Si deseas ejercer alguno de estos derechos, contáctanos a
          través de nuestra página de soporte.
        </p>
        <h2 className="text-2xl font-semibold mb-3">Contacto</h2>
        <p className="mb-4">
          Si tienes preguntas o inquietudes sobre esta Política de Privacidad,
          puedes contactarnos a través del correo electrónico
          <a
            href="mailto:soporte@equiparents.app"
            className="text-blue-600 ml-1"
          >
            soporte@equiparents.app
          </a>
          .
        </p>
      </main>
    </>
  );
}
