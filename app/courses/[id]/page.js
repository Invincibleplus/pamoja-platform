import React from 'react';
import { SEED_COURSES } from '../../../lib/seedCourses';
import CoursePlayerClient from './CoursePlayerClient';

export function generateStaticParams() {
  return SEED_COURSES.map((course) => ({
    id: course.id,
  }));
}

export default async function CoursePage({ params }) {
  const resolvedParams = await params;
  return <CoursePlayerClient initialId={resolvedParams?.id} />;
}
