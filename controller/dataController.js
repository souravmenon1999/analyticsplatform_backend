import fetch from 'node-fetch';
import { csvToJson } from '../utils/csvToJson.js';

// Your Google Sheets ID and GID (Sheet Tab ID)
const sheetId = process.env.SHEET_ID;
const sheetGid = process.env.SHEET_GID;
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${sheetGid}`;

// Helper function to parse date
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};

// Fetch and filter data
/// Fetch and filter data
export const fetchData = async (req, res) => {
  try {
    const { startDate, endDate, ageGroup, gender } = req.query;

    // Set default dates if not provided
    const start = startDate ? new Date(startDate) : new Date('1970-01-01');
    const end = endDate ? new Date(endDate) : new Date();

    // Validate date input
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).send('Invalid date format');
    }

    // Normalize ageGroup and gender
    const normalizedAgeGroup = ageGroup === 'null' ? 'all' : ageGroup;
    const normalizedGender = gender === 'null' ? 'all' : gender;

    const response = await fetch(url);
    const data = await response.text();
    const jsonData = csvToJson(data);

    const filteredData = jsonData.filter(item => {
      const itemDate = parseDate(item.Day);
      
      if (isNaN(itemDate.getTime())) {
        return false; // Skip invalid dates
      }

      const withinDateRange = itemDate >= start && itemDate <= end;

      // Filter conditions based on ageGroup and gender
      const matchesAgeGroup = normalizedAgeGroup === 'all' || item.Age === normalizedAgeGroup;
      const matchesGender = normalizedGender === 'all' || normalizedGender.toLowerCase() === item.Gender.toLowerCase();

      return withinDateRange && matchesAgeGroup && matchesGender;
    });

    if (filteredData.length === 0) {
      return res.status(204).send(); // No Content
    }

    return res.json(filteredData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send(`Error fetching data: ${error.message}`);
  }
};

