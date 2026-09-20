import React from 'react';
import { getTeamMembers } from '../services/itineraryAdminApi';
import { getAboutContent } from '../services/aboutContentApi';
import { defaultAboutContent } from '../services/aboutContentDefaults';

const getInitial = (name = '') => name.trim().charAt(0).toUpperCase() || '?';

function TeamSection({ heading }) {
  const [members, setMembers] = React.useState([]);
  const [fetchedHeading, setFetchedHeading] = React.useState(null);

  React.useEffect(() => {
    let isMounted = true;

    getTeamMembers()
      .then((response) => {
        if (isMounted) setMembers(response.data || []);
      })
      .catch(() => {
        if (isMounted) setMembers([]);
      });

    if (!heading) {
      getAboutContent()
        .then((response) => {
          if (isMounted) setFetchedHeading(response.data?.team || null);
        })
        .catch(() => {
          /* keep defaults */
        });
    }

    return () => {
      isMounted = false;
    };
  }, [heading]);

  if (members.length === 0) {
    return null;
  }

  const copy = { ...defaultAboutContent.team, ...(heading || fetchedHeading || {}) };

  return (
    <section className="fullwidth-block team-section" id="team">
      <div className="container">
        <div className="team-heading">
          {copy.kicker ? <p className="section-kicker">{copy.kicker}</p> : null}
          <h2 className="section-title">{copy.title}</h2>
          {copy.description ? <p className="team-intro">{copy.description}</p> : null}
        </div>

        <div className="team-grid">
          {members.map((member) => (
            <article className="team-card" key={member._id || member.name}>
              <figure className={`team-photo ${member.imageUrl ? '' : 'team-photo-placeholder'}`}>
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    width="280"
                    height="280"
                  />
                ) : (
                  <span aria-hidden="true">{getInitial(member.name)}</span>
                )}
              </figure>
              <h3>{member.name}</h3>
              {member.role ? <p className="team-role">{member.role}</p> : null}
              {member.bio ? <p className="team-bio">{member.bio}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeamSection;
