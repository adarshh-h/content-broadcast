const contentModel = require('../models/contentModel');
const userModel = require('../models/userModel');

// -----------------------------------------------
// CORE ROTATION LOGIC
// Each subject rotates independently
// Uses current time to find active content
// -----------------------------------------------
const getActiveContentForSubject = (contentList, now) => {
  // Filter only contents within active time window
  const activeContents = contentList.filter((c) => {
    const start = new Date(c.start_time);
    const end = new Date(c.end_time);
    return now >= start && now <= end;
  });

  if (activeContents.length === 0) return null;

  // Total cycle in milliseconds
  const totalCycleMs = activeContents.reduce((sum, c) => sum + c.duration * 60 * 1000, 0);

  // Reference start = earliest start_time
  const referenceStart = new Date(Math.min(...activeContents.map((c) => new Date(c.start_time))));

  // How far into the cycle are we?
  const elapsedMs = now - referenceStart;
  const positionMs = elapsedMs % totalCycleMs;

  // Find which content this position falls into
  let cumulativeMs = 0;
  for (const content of activeContents) {
    cumulativeMs += content.duration * 60 * 1000;
    if (positionMs < cumulativeMs) return content;
  }

  return null;
};

// -----------------------------------------------
// Get live content for a teacher
// Returns 1 active content per subject
// -----------------------------------------------
const getLiveContent = async (teacherId) => {
  const allContent = await contentModel.findApprovedByTeacher(teacherId);

  if (allContent.length === 0) return null;

  // Group by subject
  const grouped = {};
  for (const item of allContent) {
    if (!grouped[item.subject]) grouped[item.subject] = [];
    grouped[item.subject].push(item);
  }

  // Find active content per subject
  const now = new Date();
  const activeContent = [];

  for (const subject in grouped) {
    const active = getActiveContentForSubject(grouped[subject], now);
    if (active) {
      activeContent.push({
        subject,
        id: active.id,
        title: active.title,
        description: active.description,
        file_url: active.file_url,
        file_type: active.file_type,
      });
    }
  }

  return activeContent.length > 0 ? activeContent : null;
};

module.exports = { getLiveContent };
