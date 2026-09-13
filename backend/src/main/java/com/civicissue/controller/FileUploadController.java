package com.civicissue.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

/** Handles image uploads for issue reports, comments, and profile photos. */
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileUploadController {

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> upload(@RequestParam("file") MultipartFile file) throws IOException {
        Path dir = Path.of(uploadDir);
        Files.createDirectories(dir);

        String extension = "";
        String original = file.getOriginalFilename();
        if (original != null && original.contains(".")) {
            extension = original.substring(original.lastIndexOf('.'));
        }
        String filename = UUID.randomUUID() + extension;
        Path target = dir.resolve(filename);
        file.transferTo(target);

        return ResponseEntity.ok(Map.of("url", "/uploads/" + filename));
    }
}
