import Head from "next/head";

export default function TermsOfServicePage() {
  return (
    <>
      <Head>
        <title>Condiciones del Servicio - Equi·Parents</title>
        <meta
          name="description"
          content="Lee las Condiciones del Servicio de Equi·Parents para conocer tus derechos y obligaciones."
        />
      </Head>
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6">Condiciones del Servicio</h1>
        <p className="mb-4">
          Bienvenido a Equi·Parents. Al utilizar nuestros servicios, aceptas
          cumplir con las siguientes condiciones. Estas Condiciones del Servicio
          regulan el acceso y uso de nuestra plataforma, diseñada para facilitar
          la corresponsabilidad parental y optimizar el bienestar familiar.
        </p>
        <h2 className="text-2xl font-semibold mb-3">Uso del Servicio</h2>
        <p className="mb-4">
          Los usuarios deben registrarse y proporcionar información verídica
          para utilizar Equi·Parents. Se prohíbe el uso de la plataforma para
          actividades fraudulentas o ilícitas. La aplicación está diseñada para
          ayudar a gestionar tareas y acuerdos familiares; cualquier uso
          indebido podrá ser suspendido.
        </p>
        <h2 className="text-2xl font-semibold mb-3">Propiedad Intelectual</h2>
        <p className="mb-4">
          Todo el contenido, gráficos, diseño, logotipos y otros elementos de
          Equi·Parents son propiedad de la aplicación o de terceros que han
          autorizado su uso. No se permite la reproducción sin permiso expreso.
        </p>
        <h2 className="text-2xl font-semibold mb-3">
          Limitación de Responsabilidad
        </h2>
        <p className="mb-4">
          Equi·Parents se esfuerza por mantener la precisión y la seguridad de
          la información, pero no garantiza que esté libre de errores. No nos
          hacemos responsables de las decisiones o acciones basadas en el
          contenido proporcionado a través de la plataforma.
        </p>
        <h2 className="text-2xl font-semibold mb-3">
          Modificaciones del Servicio
        </h2>
        <p className="mb-4">
          Nos reservamos el derecho de modificar o interrumpir el servicio en
          cualquier momento, sin previo aviso. Las modificaciones a estas
          Condiciones se publicarán en la plataforma y se considerarán efectivas
          en el momento de su publicación.
        </p>
        <h2 className="text-2xl font-semibold mb-3">
          Resolución de Conflictos
        </h2>
        <p className="mb-4">
          Cualquier disputa relacionada con el uso de Equi·Parents se resolverá
          de conformidad con las leyes vigentes en la jurisdicción de Chile. Se
          recomienda a los usuarios comunicarse con nosotros antes de iniciar
          cualquier proceso legal.
        </p>
        <h2 className="text-2xl font-semibold mb-3">Contacto</h2>
        <p className="mb-4">
          Para cualquier consulta respecto a estas Condiciones del Servicio, por
          favor contáctanos a
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
