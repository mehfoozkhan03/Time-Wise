import "./AnnouncementFilter.css";

import { CiSearch } from "react-icons/ci";
import { AnnoucementFilterCategories } from "./AnnouncementFilterCategories/AnnouncementFilterCategories";
import { AnnouncementFilterStatus } from "./AnnouncementFilterStatus/AnnoucementFilterStatus";
import { AnnoucementFilterPriorities } from "./AnnoucementFilterPriorities/AnnoucementFilterPriorities";
import { AnnouncementFilterAudience } from "./AnnoucementFilterAudience/AnnoucementFilterAudience";
import { AnnouncementFilterNew } from "./AnnoucementFilterNew/AnnoucementFilterNew";

export const AnnouncementFilter = ({
  category,
  setCategory,
  status,
  setStatus,
  priority,
  setPriority,
  audience,
  setAudience,
  sort,
  setSort,
  search,
  setSearch,
}) => {
  return (
    <>
      <section className="announcementFilter-section">
        <div className="announcementFilter-content">
          <div className="announcementFilter-search">
            <CiSearch />
            <input
              type="search"
              placeholder="Search by title or description"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <AnnoucementFilterCategories
            category={category}
            setCategory={setCategory}
          />

          <AnnouncementFilterStatus
            status={status}
            setStatus={setStatus}
          />

          <AnnoucementFilterPriorities
            priority={priority}
            setPriority={setPriority}
          />

          <AnnouncementFilterAudience
            audience={audience}
            setAudience={setAudience}
          />

          <AnnouncementFilterNew
            sort={sort}
            setSort={setSort}
          />
        </div>
      </section>
    </>
  );
};
