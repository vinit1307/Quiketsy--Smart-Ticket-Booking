package com.ticketBooking.event.loader;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.ticketBooking.event.model.Event;
import com.ticketBooking.event.repository.EventRepository;

import org.springframework.beans.factory.annotation.Autowired;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Component
public class EventDataLoader implements CommandLineRunner {

    @Autowired
    private EventRepository eventRepository;

    private final DateTimeFormatter[] DATE_FORMATS = new DateTimeFormatter[]{
            DateTimeFormatter.ofPattern("d-M-uuuu"),
            DateTimeFormatter.ofPattern("d/M/uuuu"),
            DateTimeFormatter.ISO_LOCAL_DATE
    };

    private final DateTimeFormatter TIME_12H = DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH);

    @Override
    public void run(String... args) throws Exception {
        if (eventRepository.count() > 0) {
            System.out.println("Events already present — skipping CSV import.");
            return;
        }

        ClassPathResource resource = new ClassPathResource("data/events.csv");
        if (!resource.exists()) {
            System.out.println("CSV file not found at classpath:data/events.csv");
            return;
        }

        try (Reader in = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .setIgnoreEmptyLines(true)
                    .build();

            try (CSVParser parser = new CSVParser(in, csvFormat)) {
                List<CSVRecord> records = parser.getRecords();

                List<Event> batch = new ArrayList<>();
                for (CSVRecord r : records) {
                    Event e = new Event();

                    e.setOrganizerId(2); // Default organizer ID

                    e.setName(blank(r.get("name")));
                    e.setVenue(blank(r.get("venue")));
                    e.setCity(blank(r.get("city")));

                    String dateS = blankIfMissing(r, "event_date");
                    if (dateS != null) e.setEventDate(parseDateFlexible(dateS));

                    String timeS = blankIfMissing(r, "start_time");
                    if (timeS != null) e.setStartTime(parseTimeFlexible(timeS));

                    String durRaw = blankIfMissing(r, "duration");
                    if (durRaw != null) e.setDuration(convertDurationToInterval(durRaw));

                    e.setTicketPrice(parseIntOrNull(blankIfMissing(r, "ticket_price")));
                    e.setAgeLimit(parseIntOrNull(blankIfMissing(r, "age_limit")));
                    e.setDescription(blankIfMissing(r, "description"));
                    e.setImageUrl(blankIfMissing(r, "image_url"));
                    e.setLanguage(blankIfMissing(r, "language"));
                    e.setCategory(blankIfMissing(r, "category"));
                    e.setTags(blankIfMissing(r, "tags"));
                    e.setTotalSlots(parseIntOrNull(blankIfMissing(r, "total_slots")));
                    e.setAvailableSlots(parseIntOrNull(blankIfMissing(r, "available_slots")));

                    e.setIsTrending(parseBooleanFlexible(blankIfMissing(r, "is_trending")));
                    String status = blankIfMissing(r, "status");
                    e.setStatus(status == null ? "UPCOMING" : status.toUpperCase());

                    batch.add(e);
                }

                if (!batch.isEmpty()) {
                    eventRepository.saveAll(batch);
                    System.out.println("Imported events: " + batch.size());
                } else {
                    System.out.println("No event rows found in CSV.");
                }
            }
        }
    }

    /* -------------------- Helper Methods -------------------- */

    private static String blankIfMissing(CSVRecord r, String col) {
        try {
            String s = r.get(col);
            if (s == null) return null;
            s = s.trim();
            return s.isEmpty() ? null : s;
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }

    private static String blank(String s) {
        return (s == null || s.trim().isEmpty()) ? null : s.trim();
    }

    private static Integer parseIntOrNull(String s) {
        try {
            if (s == null) return null;
            return (int) Double.parseDouble(s);
        } catch (Exception e) {
            return null;
        }
    }

    private static Boolean parseBooleanFlexible(String s) {
        if (s == null) return false;
        s = s.trim().toLowerCase();
        return s.equals("1") || s.equals("true") || s.equals("yes");
    }

    private LocalDate parseDateFlexible(String s) {
        s = s.trim();
        for (DateTimeFormatter f : DATE_FORMATS) {
            try {
                return LocalDate.parse(s, f);
            } catch (Exception ignored) {
            }
        }
        throw new IllegalArgumentException("Unparseable date: " + s);
    }

    private LocalTime parseTimeFlexible(String s) {
        s = s.trim();
        try {
            return LocalTime.parse(s);
        } catch (Exception ignored) {
        }
        try {
            return LocalTime.parse(s, TIME_12H);
        } catch (Exception ignored) {
        }
        throw new IllegalArgumentException("Unparseable time: " + s);
    }

    private String convertDurationToInterval(String raw) {
        raw = raw.trim();
        if (raw.contains(":")) {
            String[] p = raw.split(":");
            long hh = Long.parseLong(p[0]);
            long mm = Long.parseLong(p[1]);
            return buildInterval(hh, mm);
        }
        try {
            double v = Double.parseDouble(raw);
            long hh = (long) Math.floor(v);
            long mm = Math.round((v - hh) * 60);
            if (mm == 60) {
                hh++;
                mm = 0;
            }
            return buildInterval(hh, mm);
        } catch (Exception e) {
            return raw;
        }
    }

    private String buildInterval(long hh, long mm) {
        StringBuilder sb = new StringBuilder();
        if (hh > 0) sb.append(hh).append(hh == 1 ? " hour" : " hours");
        if (mm > 0) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(mm).append(mm == 1 ? " minute" : " minutes");
        }
        if (sb.length() == 0) return "0 hours";
        return sb.toString();
    }
}
