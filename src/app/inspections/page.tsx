import { getAllFullyDetailedInspections, getAllDetailedInspectionsByBeehiveRefIDWithFrameCount } from '@/services/server/inspections/queries';
import { getSummerizedBeehiveByID } from '@/services/server/beehives/queries';
import { InspectionCard } from '@/components/inspection/InspectionCard';
import HiveCard from '@/components/HiveCard';
import { PlusCircle } from "@phosphor-icons/react/dist/ssr";
import Link from 'next/link';
import style from '@/styles/inspections/inspectionsPage.module.scss';
import inputStyles from '@/styles/inputs/inputs.module.scss';
import HeaderButton from '@/components/HeaderButton';

const InspectionsPage = async (
  { searchParams }:
    { searchParams?: { beehiveRefID?: string } }
) => {
  // Conditional if beeHiveRefID is provided.
  const allInspections: FullInspection[] = searchParams?.beehiveRefID ?
    (await getAllDetailedInspectionsByBeehiveRefIDWithFrameCount(searchParams.beehiveRefID)).documents :
    (await getAllFullyDetailedInspections()).documents

  const currentBeehive: SummerizedBeehive | null = searchParams?.beehiveRefID ?
    (await getSummerizedBeehiveByID(searchParams.beehiveRefID)).documents[0]
    : null;

  return (
    <>

      {currentBeehive ?
        <section className={style.ListingContainer}>
          <HiveCard
            href={`beehives/manage/${currentBeehive._id}`}
            img="https://placehold.co/400x400/png"
            name={currentBeehive.name}
            lastInspection={currentBeehive.last_inspection ? new Date(currentBeehive.last_inspection.last_updated) : undefined}
            illness={(currentBeehive.last_inspection && currentBeehive.last_inspection.illness) ? true : false}
            location={currentBeehive.location.coordinates}
            sensor={currentBeehive.last_sensor_entry ? true : false}
          />
        </section>
        : null
      }

      {/* TODO: change this section to search and CRUD component. */}
      <section className={inputStyles.searchAndCrud}>
        <div className={inputStyles.searchField}>
          {/* Insert search field */}
        </div>
        <HeaderButton
          href={{
            pathname: '/inspections/create/',
            query: searchParams ? { beehiveRefID: searchParams.beehiveRefID } : null
          }}
          icon={<PlusCircle weight='fill' size={64} />}>
          Create <br /> note
        </HeaderButton>
      </section>

      {/** Problem beehive section.  **/}
      <section className={style.ListingContainer}>
        {allInspections.length > 0 ?
          <>
            <h2>Inspections with problems:</h2>
            {allInspections.map((inspection =>
              inspection.illness || inspection.medication || inspection.draft ?
                <Link key={inspection._id} href={{
                  pathname: `inspections/manage/${inspection._id}`,
                  query: { beehiveRefID: searchParams?.beehiveRefID ?? undefined }
                }}>
                  <InspectionCard
                    inspectionID={inspection._id}
                    img={inspection.img}
                    title={inspection.title}
                    description={inspection.description ? inspection.description : "-no data-"}
                    illness={inspection.illness}
                    medication={inspection.medication}
                    draft={inspection.draft}
                    creation_date={inspection.creation_date}
                    last_updated={inspection.last_updated}
                  />
                </Link>
                // Do not render anything if illness, medication and draft are all false.
                : null
            ))}
          </>
          : <p>Great! there are no problems.</p>
        }
      </section>

      {/** All beehive section.  **/}
      <section className={style.ListingContainer}>
        <h2>All inspections:</h2>
        {allInspections.length > 0 ?
          allInspections.map((inspection =>
            <Link key={inspection._id} href={{
              pathname: `inspections/manage/${inspection._id}`,
              query: { beehiveRefID: searchParams?.beehiveRefID ?? undefined }
            }}
            >
              <InspectionCard
                inspectionID={inspection._id}
                img={inspection.img}
                title={inspection.title}
                description={inspection.description}
                illness={inspection.illness}
                medication={inspection.medication}
                draft={inspection.draft}
                creation_date={inspection.creation_date}
                last_updated={inspection.last_updated}
              />
            </Link>
          ))
          : "There are no inspections for this beehive."
        }
      </section>
    </>
  );
}

export default InspectionsPage;