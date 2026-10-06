import { accompagnateurName } from "@/lib/accompagnement";
import { contactEmail } from "@/lib/site";

const kept = [
  "Ton prénom et ton nom, et l'adresse e-mail du compte.",
  "Le mot de passe, gardé sous une forme chiffrée. Personne ne peut le relire.",
  "Le pays, la ville, l'école, l'étape du parcours et l'année, si tu les indiques.",
  "La date d'arrivée et la date de fin du titre, si tu les remplis.",
  "Les étapes que tu coches.",
  "Les pages ouvertes pendant que tu es connecté : le chemin et la date. L'adresse IP n'est pas enregistrée.",
  "L'e-mail d'un essai de connexion raté, le temps de freiner les répétitions. Il est effacé quand cette adresse se connecte.",
  "Le lien de mot de passe oublié, sous forme chiffrée, pendant une heure.",
  "Les messages du groupe, avec le nom de celui qui écrit, jusqu'à ce que le message soit retiré. Une image ou un PDF peut y être joint par Thierno BARRY ou Ibrahima Talibé DIALLO. Les étudiants n'en envoient pas.",
  "Le formulaire de contact : ton nom, ton e-mail, ton numéro si tu le donnes, et ton message. Thierno BARRY et Ibrahima Talibé DIALLO le voient.",
  "Les images et les PDF publiés par l'administration pour informer. Tu ne peux pas en envoyer.",
];

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.16em] text-blue">Tes informations</p>
      <h1 className="mt-2 font-serif text-4xl">Politique de confidentialité</h1>
      <p className="mt-3 text-muted">
        Parcourstudent en France est tenu par Thierno BARRY et Ibrahima Talibé DIALLO. Le compte sert à ouvrir le guide et à t&apos;y reconnecter. Aucun dossier de candidature ou de visa n&apos;est déposé ici, et tes informations ne sont pas vendues.
      </p>
      <section className="mt-8">
        <h2 className="font-serif text-2xl">Ce qui est gardé</h2>
        <ul className="mt-3 grid gap-2 text-sm leading-6">
          {kept.map((item) => (
            <li key={item} className="rounded-2xl border border-line bg-card px-4 py-3">{item}</li>
          ))}
        </ul>
      </section>
      <section className="mt-8">
        <h2 className="font-serif text-2xl">Qui peut le voir</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Thierno BARRY et {accompagnateurName} tiennent le groupe. Ils voient l&apos;administration du site. {accompagnateurName} ne gère pas les groupes, les liens ni les vidéos. Les autres étudiants voient ton nom et tes messages. Ces informations ne sont pas envoyées à Campus France, à France-Visas, ni à une école.
        </p>
      </section>
      <section className="mt-8">
        <h2 className="font-serif text-2xl">WhatsApp et les vidéos</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Si tu ouvres un groupe WhatsApp, ton numéro est visible par les membres du groupe. Parcourstudent ne le reçoit pas. Si tu lances une vidéo YouTube publiée sur une étape, YouTube voit cette lecture.
        </p>
      </section>
      <section className="mt-8">
        <h2 className="font-serif text-2xl">Le cookie de connexion</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Un cookie, nommé parcours_session, garde la connexion pendant quatorze jours. Il ne sert qu&apos;à ça. Il n&apos;y a pas de cookie publicitaire.
        </p>
      </section>
      <section className="mt-8">
        <h2 className="font-serif text-2xl">Combien de temps</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Le compte reste tant qu&apos;il n&apos;est pas supprimé. Le lien de mot de passe oublié expire au bout d&apos;une heure.
        </p>
      </section>
      <section className="mt-8">
        <h2 className="font-serif text-2xl">Tes droits</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Tu peux demander à voir ton compte, le corriger ou le supprimer.
          {contactEmail ? (
            <>
              {" "}Écris à <a className="text-blue underline" href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </>
          ) : (
            " L'adresse pour écrire à Thierno BARRY sera affichée ici."
          )}
          {" "}Si la réponse ne te convient pas, tu peux saisir la CNIL, sur cnil.fr.
        </p>
      </section>
    </div>
  );
}
