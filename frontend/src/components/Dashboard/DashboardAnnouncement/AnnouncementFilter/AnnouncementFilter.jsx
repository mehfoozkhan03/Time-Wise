import "./AnnouncementFilter.css";

import { CiSearch } from "react-icons/ci";
import { AnnoucementFilterCategories } from "./AnnouncementFilterCategories/AnnoucementFilterCategories";
import { AnnouncementFilterStatus } from './AnnouncementFilterStatus/AnnoucementFilterStatus';
import { AnnoucementFilterPriorities } from "./AnnoucementFilterPriorities/AnnoucementFilterPriorities";
import { AnnouncementFilterAudience } from "./AnnoucementFilterAudience/AnnoucementFilterAudience";
import { AnnouncementFilterNew } from './AnnoucementFilterNew/AnnoucementFilterNew';

export const AnnouncementFilter = () => {
    return (
        <>
            <section className="announcementFilter-section">
                <div className="announcementFilter-content">
                    <div className="announcementFilter-search">
                        <CiSearch />
                        <input type="search" placeholder="Search announcements..." />
                    </div>

                    <AnnoucementFilterCategories />

                    <AnnouncementFilterStatus />

                    <AnnoucementFilterPriorities />

                    <AnnouncementFilterAudience />

                    <AnnouncementFilterNew />
                </div>
            </section>
        </>
    )
}