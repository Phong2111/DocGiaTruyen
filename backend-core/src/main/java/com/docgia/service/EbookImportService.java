package com.docgia.service;

import com.docgia.dto.ChapterRequest;
import com.docgia.dto.NovelRequest;
import com.docgia.dto.NovelResponse;
import com.docgia.model.User;
import com.docgia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.siegmann.epublib.domain.Book;
import nl.siegmann.epublib.domain.Resource;
import nl.siegmann.epublib.domain.TOCReference;
import nl.siegmann.epublib.domain.SpineReference;
import nl.siegmann.epublib.epub.EpubReader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.safety.Safelist;

@Service
@RequiredArgsConstructor
@Slf4j
public class EbookImportService {

    private final NovelService novelService;
    private final ChapterService chapterService;
    private final UserRepository userRepository;

    public NovelResponse importEpub(MultipartFile file, String username) throws IOException {
        String fileName = file.getOriginalFilename();
        log.info("Importing EPUB: {} for user: {}", fileName, username);
        
        if (fileName == null || !fileName.toLowerCase().endsWith(".epub")) {
            throw new RuntimeException("Chỉ hỗ trợ định dạng EPUB tại thời điểm này.");
        }
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        EpubReader epubReader = new EpubReader();
        Book book = epubReader.readEpub(file.getInputStream());
        
        if (book == null) {
            throw new RuntimeException("Không thể đọc file EPUB. File có thể bị lỗi hoặc không đúng định dạng.");
        }

        String title = book.getTitle();
        String author = "Unknown";
        if (book.getMetadata().getAuthors() != null && !book.getMetadata().getAuthors().isEmpty()) {
            author = book.getMetadata().getAuthors().get(0).getFirstname();
            if (book.getMetadata().getAuthors().get(0).getLastname() != null) {
                author += " " + book.getMetadata().getAuthors().get(0).getLastname();
            }
        }
        
        // Create Novel
        NovelRequest novelRequest = NovelRequest.builder()
                .title(title != null ? title : "Imported Novel")
                .author(author)
                .description("Imported from EPUB")
                .genres("Imported")
                .isPublic(false)
                .build();

        NovelResponse novelResponse = novelService.createNovel(novelRequest, username);

        // Import Chapters
        List<TOCReference> tocReferences = book.getTableOfContents().getTocReferences();
        if (tocReferences.isEmpty()) {
            // Fallback to spine if TOC is empty
            int chapterNum = 1;
            for (SpineReference spineReference : book.getSpine().getSpineReferences()) {
            Resource resource = spineReference.getResource();
            if (resource != null && resource.getMediaType() != null && 
                "application/xhtml+xml".equals(resource.getMediaType().getName())) {
                
                byte[] data = resource.getData();
                if (data != null && data.length > 0) {
                    String content = new String(data, StandardCharsets.UTF_8);
                    String cleanContent = cleanHtml(content);
                    
                    ChapterRequest chapterRequest = ChapterRequest.builder()
                            .title("Chapter " + chapterNum)
                            .content(cleanContent)
                            .chapterNumber(chapterNum)
                            .build();
                    chapterService.createChapter(novelResponse.getId(), chapterRequest, username);
                    chapterNum++;
                }
            }
        }
    } else {
        importTocReferences(novelResponse.getId(), tocReferences, username, 1);
    }

    return novelResponse;
}

private int importTocReferences(Long novelId, List<TOCReference> tocReferences, String username, int chapterNumber) throws IOException {
    for (TOCReference tocReference : tocReferences) {
        String title = tocReference.getTitle();
        Resource resource = tocReference.getResource();
        if (resource != null && resource.getMediaType() != null && 
            "application/xhtml+xml".equals(resource.getMediaType().getName())) {
            
            byte[] data = resource.getData();
            if (data != null && data.length > 0) {
                String content = new String(data, StandardCharsets.UTF_8);
                String cleanContent = cleanHtml(content);
                
                ChapterRequest chapterRequest = ChapterRequest.builder()
                        .title(title)
                        .content(cleanContent)
                        .chapterNumber(chapterNumber++)
                        .build();
                chapterService.createChapter(novelId, chapterRequest, username);
            }
        }
        
        if (tocReference.getChildren() != null && !tocReference.getChildren().isEmpty()) {
            chapterNumber = importTocReferences(novelId, tocReference.getChildren(), username, chapterNumber);
        }
    }
    return chapterNumber;
}

private String cleanHtml(String html) {
    if (html == null || html.isEmpty()) return "";
    
    Document doc = Jsoup.parse(html);
    
    // Remove style and script tags
    doc.select("style, script, head").remove();
    
    // Replace block elements with newlines to preserve structure
    doc.select("p, div, h1, h2, h3, h4, h5, h6").prepend("\n\n");
    doc.select("br").prepend("\n");
    
    String cleanText = doc.text();
    
    // Clean up multiple newlines (3 or more -> 2)
    return cleanText.replaceAll("\n{3,}", "\n\n").trim();
}
}
