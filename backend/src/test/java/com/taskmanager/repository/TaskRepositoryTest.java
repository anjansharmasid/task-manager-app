package com.taskmanager.repository;

import com.taskmanager.model.Task;
import com.taskmanager.model.TaskTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class TaskRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TaskRepository taskRepository;

    @Test
    void testSaveTask() {
        Task task = Task.builder()
                .title("Test Task")
                .description("Test Description")
                .status("pending")
                .dueDate(LocalDateTime.now().plusDays(1))
                .build();

        Task savedTask = taskRepository.save(task);
        assertNotNull(savedTask.getId());
        assertEquals("Test Task", savedTask.getTitle());
        assertNotNull(savedTask.getCreatedAt());
    }

    @Test
    void testFindById() {
        Task task = Task.builder()
                .title("Find Me")
                .dueDate(LocalDateTime.now().plusDays(1))
                .build();
        
        Task savedTask = entityManager.persistAndFlush(task);
        
        Optional<Task> foundTask = taskRepository.findById(savedTask.getId());
        assertTrue(foundTask.isPresent());
        assertEquals("Find Me", foundTask.get().getTitle());
    }

    @Test
    void testFindAll() {
        Task task1 = Task.builder()
                .title("Task 1")
                .dueDate(LocalDateTime.now().plusDays(1))
                .build();
        
        Task task2 = Task.builder()
                .title("Task 2")
                .dueDate(LocalDateTime.now().plusDays(2))
                .build();

        entityManager.persist(task1);
        entityManager.persist(task2);
        entityManager.flush();

        List<Task> tasks = taskRepository.findAll();
        assertEquals(2, tasks.size());
        assertTrue(tasks.stream().anyMatch(t -> t.getTitle().equals("Task 1")));
        assertTrue(tasks.stream().anyMatch(t -> t.getTitle().equals("Task 2")));
    }

    @Test
    void testDeleteTask() {
        Task task = Task.builder()
                .title("To be deleted")
                .dueDate(LocalDateTime.now().plusDays(1))
                .build();
        
        Task savedTask = entityManager.persistAndFlush(task);
        UUID taskId = savedTask.getId();

        taskRepository.deleteById(taskId);
        entityManager.flush();

        Optional<Task> deletedTask = taskRepository.findById(taskId);
        assertFalse(deletedTask.isPresent());
    }

    @Test
    void testFindByIdNotFound() {
        Optional<Task> task = taskRepository.findById(UUID.randomUUID());
        assertFalse(task.isPresent());
    }

}